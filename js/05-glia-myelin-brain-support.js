/**
 * Chapter 5: Glia, Myelin & Brain Support - Tab Navigation
 * Mirrors the tab pattern used in Chapter 3 for consistent UX across chapters
 */

document.addEventListener('DOMContentLoaded', function () {
  initTabNavigation();
});

function initTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length || !tabContents.length) {
    return;
  }

  tabButtons.forEach((button, index) => {
    button.setAttribute('tabindex', '0');
    button.addEventListener('click', function () {
      const targetId = this.getAttribute('aria-controls');
      switchTab(targetId, this);
    });

    button.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const nextIndex = e.key === 'ArrowRight'
          ? (index + 1) % tabButtons.length
          : (index - 1 + tabButtons.length) % tabButtons.length;
        tabButtons[nextIndex].focus();
      }
    });
  });
}

function switchTab(activeTabId, activeButton) {
  const tabContents = document.querySelectorAll('.tab-content');
  const tabButtons = document.querySelectorAll('.tab-button');

  tabContents.forEach(content => {
    content.classList.remove('active');
  });

  tabButtons.forEach(button => {
    button.setAttribute('aria-selected', 'false');
    button.classList.remove('text-teal-700');
    button.classList.add('text-gray-500');
  });

  const activeContent = document.getElementById(activeTabId);
  if (activeContent) {
    activeContent.classList.add('active');
  }

  if (activeButton) {
    activeButton.setAttribute('aria-selected', 'true');
    activeButton.classList.remove('text-gray-500');
    activeButton.classList.add('text-teal-700');
  }
}
