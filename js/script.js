/*
 * 12주차 인터랙티브반 공통 실습 시작 파일
 *
 * 현재 구현됨: 페이지 진입 애니메이션과 연도별 실업률 비교.
 *
 * 비교 기능의 부모: .unemployment-compare-section
 * 선택 버튼: .year-button-a / .year-button-b
 * 변경 대상: .year-rate / .year-description / .year-chart
 */

// 기존에 정상 작동하는 화면 진입 효과. 기능 추가 시 유지한다.
document.documentElement.classList.add('has-js');
const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealSections.forEach((section) => observer.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
}

const heroRate = document.querySelector('.hero-big-number');
if (heroRate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const rateText = heroRate.firstChild;
  const startRate = 4.2;
  const duration = 1800;
  let startTime;
  rateText.textContent = '0';

  const countUp = (time) => {
    if (startTime === undefined) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    rateText.textContent = (startRate * easedProgress).toFixed(1);
    if (progress < 1) requestAnimationFrame(countUp);
  };

  requestAnimationFrame(countUp);
}

const compareSection = document.querySelector('.unemployment-compare-section');

if (compareSection) {
  const yearButtonA = compareSection.querySelector('.year-button-a');
  const yearButtonB = compareSection.querySelector('.year-button-b');
  const rate = compareSection.querySelector('.year-rate');
  const yearLabel = compareSection.querySelector('.year-label');
  const title = compareSection.querySelector('.metric-title');
  const description = compareSection.querySelector('.year-description');
  const chart = compareSection.querySelector('.year-chart');
  const chartYear = compareSection.querySelector('.chart-footer span');
  const chartStatus = compareSection.querySelector('.chart-status');
  const years = {
    a: {
      label: 'A',
      rate: '4.2',
      title: '연도 A의 실업률 변화',
      description: '연도 A를 선택한 화면입니다. 학습용 수치를 기반으로 그래프와 설명이 표시됩니다.',
      image: 'images/year-a.jpg',
      alt: '가상 데이터 연도 A 실업률 추이 그래프'
    },
    b: {
      label: 'B',
      rate: '3.6',
      title: '연도 B의 실업률 변화',
      description: '연도 B를 선택한 화면입니다. 학습용 수치를 기반으로 그래프와 설명이 표시됩니다.',
      image: 'images/year-b.jpg',
      alt: '가상 데이터 연도 B 실업률 추이 그래프'
    }
  };

  const selectYear = (year) => {
    const data = years[year];
    const percent = document.createElement('span');
    percent.textContent = '%';
    rate.replaceChildren(document.createTextNode(data.rate), percent);
    yearLabel.textContent = `YEAR ${data.label}`;
    title.textContent = data.title;
    description.textContent = data.description;
    chart.src = data.image;
    chart.alt = data.alt;
    chartYear.textContent = `연도 ${data.label}`;
    chartStatus.textContent = `연도 ${data.label} 그래프가 표시 중입니다.`;
    yearButtonA.classList.toggle('active', year === 'a');
    yearButtonA.setAttribute('aria-pressed', String(year === 'a'));
    yearButtonB.classList.toggle('active', year === 'b');
    yearButtonB.setAttribute('aria-pressed', String(year === 'b'));
  };

  yearButtonA.addEventListener('click', () => selectYear('a'));
  yearButtonB.addEventListener('click', () => selectYear('b'));
}
