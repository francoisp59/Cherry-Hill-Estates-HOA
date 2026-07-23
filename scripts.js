function showError(container, message) {
    if (!container) return;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-center my-4';
    errorDiv.innerHTML = `
        <p class="font-medium">Unable to load content</p>
        <p class="text-sm">${message}</p>
    `;
    container.appendChild(errorDiv);
}

function injectConfig() {
    document.querySelectorAll('.js-community-name').forEach(el => {
        el.textContent = SITE_CONFIG.communityName;
    });
    document.querySelectorAll('.js-contact-email').forEach(el => {
        el.textContent = SITE_CONFIG.contactEmail;
    });
    document.querySelectorAll('.js-contact-link').forEach(el => {
        el.href = `mailto:${SITE_CONFIG.contactEmail}`;
    });
    document.querySelectorAll('.js-city').forEach(el => {
        el.textContent = SITE_CONFIG.city;
    });
    document.querySelectorAll('.js-copyright-name').forEach(el => {
        el.textContent = SITE_CONFIG.copyrightName;
    });
    document.querySelectorAll('.js-welcome-title').forEach(el => {
        el.textContent = SITE_CONFIG.welcomeTitle;
    });
    document.querySelectorAll('.js-welcome-subtitle').forEach(el => {
        el.textContent = SITE_CONFIG.welcomeSubtitle;
    });
    document.querySelectorAll('.js-city-url').forEach(el => {
        const link = document.createElement('a');
        link.href = SITE_CONFIG.cityOrdinanceUrl;
        link.target = '_blank';
        link.className = 'hover:underline font-medium';
        link.textContent = el.textContent;
        el.innerHTML = '';
        el.appendChild(link);
    });
}

async function loadNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    const limit = container.dataset.limit ? parseInt(container.dataset.limit) : null;

    try {
        const listResponse = await fetch(`news_list.json?t=${Date.now()}`);
        if (!listResponse.ok) throw new Error('Could not load news manifest');

        const newsList = await listResponse.json();
        const now = new Date();

        const activeNews = newsList.filter(item => new Date(item.expiry) >= now);
        let renderedCount = 0;

        for (const item of activeNews) {
            if (limit && renderedCount >= limit) break;

            try {
                const response = await fetch(`latest_news/${item.file}`);
                if (!response.ok) {
                    console.warn(`Could not load news file: ${item.file}`);
                    continue;
                }

                const text = await response.text();
                const lines = text.split('\n').filter(line => line.trim() !== '');
                if (lines.length === 0) continue;

                const title = lines[0].replace(/^#\s*/, '');
                const contentLines = lines.slice(1);

                const summaryLines = contentLines.slice(0, 2);
                const remainingLines = contentLines.slice(2);

                const summary = summaryLines.join(' ');
                const fullContent = contentLines.join('<br>');
                const hasMore = remainingLines.length > 0;

                const newsCard = document.createElement('div');
                newsCard.className = 'bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600';
                newsCard.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="text-xl font-bold text-gray-800">${title}</h3>
                    </div>
                    <div class="news-body">
                        <p class="text-gray-600 summary-text">${summary}</p>
                        <div class="hidden full-text mt-2 text-gray-600">${fullContent}</div>
                    </div>
                    ${hasMore ? `<button class="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition toggle-news">Read More</button>` : ''}
                `;

                if (hasMore) {
                    const btn = newsCard.querySelector('.toggle-news');
                    btn.addEventListener('click', () => {
                        const summaryEl = newsCard.querySelector('.summary-text');
                        const fullEl = newsCard.querySelector('.full-text');
                        const isExpanded = !fullEl.classList.contains('hidden');

                        if (isExpanded) {
                            fullEl.classList.add('hidden');
                            summaryEl.classList.remove('hidden');
                            btn.textContent = 'Read More';
                        } else {
                            fullEl.classList.remove('hidden');
                            summaryEl.classList.add('hidden');
                            btn.textContent = 'Show Less';
                        }
                    });
                }

                container.appendChild(newsCard);
                renderedCount++;
            } catch (fileErr) {
                console.error(`Error loading individual news item ${item.file}:`, fileErr);
            }
        }

        if (limit && activeNews.length > limit) {
            const viewAllBtn = document.createElement('div');
            viewAllBtn.className = 'pt-4 text-center';
            viewAllBtn.innerHTML = `
                <a href="news.html" class="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 transition shadow-sm">
                    View All News <span class="ml-2">→</span>
                </a>
            `;
            container.appendChild(viewAllBtn);
        }

    } catch (err) {
        console.error(`Error loading news manifest:`, err);
        showError(container, `Could not load community news: ${err.message}`);
    }
}

async function loadDocuments() {
    const container = document.getElementById('docs-container');
    if (!container) return;

    try {
        const response = await fetch('docs_meta/documents.json');
        if (!response.ok) throw new Error('Could not load documents metadata');

        const documents = await response.json();

        for (const data of documents) {
            if (!data.fileName || !data.fileName.toLowerCase().endsWith('.pdf')) {
                console.warn(`Skipping document: ${data.name}. Not a valid PDF reference.`);
                continue;
            }

            const docCard = document.createElement('div');
            docCard.className = 'bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between';
            docCard.innerHTML = `
                <div class="mb-6 md:mb-0">
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${data.name}</h2>
                    <p class="text-gray-600">Released: ${data.date}</p>
                </div>
                <a href="docs/${data.fileName}" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Download PDF
                </a>
            `;

            container.appendChild(docCard);
        }
    } catch (err) {
        console.error(`Error loading documents:`, err);
        showError(container, `Could not load documents list: ${err.message}`);
    }
}

function loadBoard() {
    const container = document.getElementById('board-container');
    if (!container || !SITE_CONFIG.boardMembers) return;

    SITE_CONFIG.boardMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center';
        memberCard.innerHTML = `
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                ${member.initial}
            </div>
            <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-lg">${member.name}</h3>
                <p class="text-gray-500 text-sm">${member.role}</p>
            </div>
            <a href="mailto:${member.email}" class="text-blue-600 hover:text-blue-800 text-sm font-medium transition px-3 py-1 rounded-lg hover:bg-blue-50">
                Contact
            </a>
        `;
        container.appendChild(memberCard);
    });
}

async function loadOrdinances() {
    const container = document.getElementById('ordinances-container');
    if (!container) return;

    try {
        const response = await fetch('ordinances_list.json');
        if (!response.ok) throw new Error('Could not load ordinances manifest');

        const manifest = await response.json();

        for (const fileName of manifest) {
            try {
                const ordResponse = await fetch(`ordinances/${fileName}`);
                if (!ordResponse.ok) {
                    console.warn(`Could not load ordinance file: ${fileName}`);
                    continue;
                }

                const data = await ordResponse.json();

                const li = document.createElement('li');
                li.className = 'flex items-start';

                const linkHtml = data.link
                    ? `<a href="${data.link}" target="_blank" class="text-blue-600 hover:underline ml-1 font-medium">View Official Code -></a>`
                    : '';

                li.innerHTML = `
                    <span class="text-blue-500 mr-2">✓</span>
                    <span class="text-gray-700">
                        <strong class="font-bold">${data.title}:</strong> ${data.description}
                        ${linkHtml}
                    </span>
                `;

                container.appendChild(li);
            } catch (fileErr) {
                console.error(`Error loading individual ordinance ${fileName}:`, fileErr);
            }
        }
    } catch (err) {
        console.error(`Error loading ordinances manifest:`, err);
        showError(container, `Could not load city ordinances: ${err.message}`);
    }
}

async function loadTips() {
    const container = document.getElementById('tips-container');
    if (!container) return;

    try {
        const response = await fetch('tips/tips.json');
        if (!response.ok) throw new Error('Could not load community tips');

        const categories = await response.json();

        for (const catData of categories) {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'bg-white p-6 rounded-2xl shadow-sm border border-gray-200';

            categoryCard.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900">${catData.name}</h2>
                </div>
                <ul class="space-y-4 provider-list">
                </ul>
            `;

            const providerList = categoryCard.querySelector('.provider-list');

            if (catData.providers && Array.isArray(catData.providers)) {
                for (const provData of catData.providers) {
                    const li = document.createElement('li');
                    li.className = 'border-b border-gray-100 pb-2';

                    let contactHtml = '';
                    if (provData.phone) contactHtml += `<div class="block">${provData.phone}</div>`;
                    if (provData.email) contactHtml += `<div class="block"><a href="mailto:${provData.email}" class="hover:underline">${provData.email}</a></div>`;
                    if (provData.website) contactHtml += `<div class="block"><a href="${provData.website}" target="_blank" class="hover:underline">Website</a></div>`;

                    li.innerHTML = `
                        <div class="font-bold text-gray-800">${provData.name}</div>
                        <div class="text-sm text-gray-500 mb-1">${provData.description || ''}</div>
                        <div class="text-blue-600 text-sm font-medium mt-1 space-y-0.5">${contactHtml}</div>
                    `;

                    providerList.appendChild(li);
                }
            }

            container.appendChild(categoryCard);
        }
    } catch (err) {
        console.error(`Error loading community tips:`, err);
        showError(container, `Could not load community tips: ${err.message}`);
    }
}

// Run as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    injectConfig();
    loadNews();
    loadDocuments();
    loadBoard();
    loadOrdinances();
    loadTips();
});
