document.addEventListener('DOMContentLoaded', () => {
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getSpeed" });
  });

  
  document.getElementById('applySpeed').addEventListener('click', () => {
    const inputhiz = parseFloat(document.getElementById('speedInput').value);
    const secspeed = parseFloat(document.getElementById('speedSelect').value);
    const finalhiz = !isNaN(inputhiz) ? inputhiz : secspeed;

    if (!isNaN(finalhiz) && finalhiz > 0) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "setSpeed", value: finalhiz });
      });
    } else {
      alert('Lütfen geçerli bir hız değeri girin veya seçin.');
    }
  });
});


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "currentSpeed") {
    const speedValue = msg.value;
    const speedSelect = document.getElementById('speedSelect');

    
    const exists = [...speedSelect.options].some(opt => parseFloat(opt.value) === speedValue);

    if (!exists) {
      const opt = document.createElement("option");
      opt.value = speedValue;
      opt.textContent = `${speedValue}x (Mevcut)`;
      opt.selected = true;
      speedSelect.insertBefore(opt, speedSelect.firstChild);
    } else {
      speedSelect.value = speedValue;
    }
  }
});
