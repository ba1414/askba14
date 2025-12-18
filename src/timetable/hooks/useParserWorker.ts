/**
 * Hook for managing parser web worker
 */

import { useRef, useCallback, useEffect, useState } from 'react';
import { ParseResult } from '../types';
import type { ParserMessage, ParserResponse } from '../workers/parser.worker';

interface ParserJob {
  id: string;
  onProgress?: (progress: number, stage: string) => void;
  onDebug?: (debugInfo: any) => void;
  onComplete: (result: ParseResult) => void;
  onError: (error: string) => void;
}

export function useParserWorker() {
  const workerRef = useRef<Worker | null>(null);
  const jobsRef = useRef<Map<string, ParserJob>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Create worker
    try {
      const worker = new Worker(
        new URL('../workers/parser.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (e: MessageEvent<ParserResponse>) => {
        const { type, id, data } = e.data;
        const job = jobsRef.current.get(id);

        if (!job) return;

        switch (type) {
          case 'progress':
            job.onProgress?.(data.progress, data.stage);
            break;

          case 'debug':
            job.onDebug?.(data);
            break;

          case 'result':
            job.onComplete(data);
            jobsRef.current.delete(id);
            break;

          case 'error':
            job.onError(data.error);
            jobsRef.current.delete(id);
            break;
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        // Notify all pending jobs
        jobsRef.current.forEach(job => {
          job.onError('Worker crashed');
        });
        jobsRef.current.clear();
      };

      workerRef.current = worker;
      setIsReady(true);

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (error) {
      console.error('Failed to create worker:', error);
      setIsReady(false);
    }
  }, []);

  const parseText = useCallback((
    content: string,
    onProgress?: (progress: number, stage: string) => void,
    onDebug?: (debugInfo: any) => void
  ): Promise<ParseResult> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error('Worker not ready'));
        return;
      }

      const id = `job-${Date.now()}-${Math.random()}`;
      const job: ParserJob = {
        id,
        onProgress,
        onDebug,
        onComplete: resolve,
        onError: reject
      };

      jobsRef.current.set(id, job);

      const message: ParserMessage = {
        type: 'parse-text',
        id,
        payload: { content }
      };

      workerRef.current.postMessage(message);
    });
  }, []);

  const cancel = useCallback((jobId?: string) => {
    if (!workerRef.current) return;

    const message: ParserMessage = {
      type: 'cancel',
      id: jobId || 'all'
    };

    workerRef.current.postMessage(message);

    if (jobId) {
      jobsRef.current.delete(jobId);
    } else {
      jobsRef.current.clear();
    }
  }, []);

  return {
    isReady,
    parseText,
    cancel
  };
}
