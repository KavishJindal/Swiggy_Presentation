
document.addEventListener("DOMContentLoaded", () => {
    // 1. Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    const enterBtn = document.getElementById('enter-btn');
    
    if (splash && enterBtn) {
        if (!sessionStorage.getItem('projectEnteredV4')) {
            splash.style.visibility = 'visible';
            splash.style.opacity = '1';
        } else {
            splash.style.display = 'none';
        }

        enterBtn.addEventListener('click', () => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                sessionStorage.setItem('projectEnteredV4', 'true');
                
                // Trigger chart rendering if on financials page after splash closes
                if(document.getElementById('financialChart')) {
                    renderChart();
                }
            }, 600);
        });
    }

    // 2. Active Sidebar Link Logic & Breadcrumb update
    const links = document.querySelectorAll(".nav-item");
    const currentUrl = window.location.href;
    const crumbText = document.getElementById('current-page-crumb');
    
    let isActiveSet = false;

    links.forEach(link => {
        const href = link.getAttribute("href");
        // Check if current URL ends with the href, or if it's the root/index
        if (currentUrl.endsWith(href) || (currentUrl.endsWith("/") && href === "index.html")) {
            link.classList.add("active");
            if(crumbText) {
                crumbText.textContent = link.querySelector('span').textContent;
            }
            isActiveSet = true;
        }
    });

    // Fallback for local file opening where URL might not match perfectly
    if(!isActiveSet && links.length > 0) {
        let pathParts = window.location.pathname.split('/');
        let file = pathParts[pathParts.length - 1];
        if(file === '') file = 'index.html';
        
        links.forEach(link => {
            if(link.getAttribute("href") === file) {
                link.classList.add("active");
                if(crumbText) crumbText.textContent = link.querySelector('span').textContent;
            }
        });
    }

    // 3. Chart.js rendering (Only on financials.html)
    if(document.getElementById('financialChart') && (!splash || splash.style.display === 'none')) {
        renderChart();
    }

    function renderChart() {
        const ctx = document.getElementById('financialChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Food Delivery EBITDA', 'Instamart EBITDA (Loss)'],
                datasets: [{
                    label: 'Q1 FY2027 (₹ Cr)',
                    data: [292, -778],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)', // Green
                        'rgba(239, 68, 68, 0.8)'   // Red
                    ],
                    borderColor: [
                        'rgb(16, 185, 129)',
                        'rgb(239, 68, 68)'
                    ],
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.raw + ' Cr';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        grid: { color: '#e2e8f0', drawBorder: false },
                        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" } }
                    },
                    x: {
                        grid: { display: false, drawBorder: false },
                        ticks: { font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' } }
                    }
                }
            }
        });
    }
});
