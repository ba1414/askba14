import React from 'react';

const Footer = () => (
  <footer>
    <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="max-w-3xl text-[13px] text-[var(--text-muted)] leading-relaxed">
            <p className="mb-3">版權及免責聲明</p>
            <p className="mb-2">本網站由個人整理及維護，內容僅作一般參考及自學之用，與任何院校、機構或公司並無合作或隸屬關係，亦不構成其官方立場。</p>
            <p className="mb-2">有關課程收生、入學要求、時間表及最新政策，如與本網站有所出入，概以相關機構或院校之官方網站及正式公佈資料為準，建議使用者自行查證。</p>
            <p className="mb-0">網站內容多屬個人觀點及公開資料之歸納，未必適用於每一個個案，亦不宜視為專業建議或保証。使用者於參考時，請自行衡量及判斷，本網站對因此而產生之任何後果，恐難以作出保證或承擔。</p>
            <div className="mt-4 text-center">
              <span className="text-xs text-[var(--text-muted)]">© <a href="https://www.instagram.com/baaa.14_?igsh=OTAwZ3Fuemx4OWg5&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@baaa.14_</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
