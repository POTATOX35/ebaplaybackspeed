chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSpeed") {
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const win = iframe.contentWindow;
        const btn = win.document.querySelector('#spSkipIntroPlaybackRate');
        if (btn) {
          // FORZA UGANDA
          const value = btn.value.replace('×', '');
          const speed = parseFloat(value);
          if (!isNaN(speed)) {
            chrome.runtime.sendMessage({ action: "currentSpeed", value: speed });
            break;
          }
        }
      } catch (e) {
        console.warn('iframe erişilemedi:', e);
      }
    }
  }

  if (msg.action === "setSpeed") {
    const code = `
      (function() {
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
          try {
            const win = iframe.contentWindow;
            const player = win.videojs && win.videojs('com_sebit_plugins_SkipIntro_Video_Container_video1');
            if (player) {
              player.ready(function () {
                player.playbackRate(${msg.value});
                console.log('[EBA SpeedUp] Hız: ${msg.value}x');
              });
              const btn = win.document.querySelector('#spSkipIntroPlaybackRate');
              if (btn) {
                btn.value = "${msg.value}×";
              }
              break;
            }
          } catch (e) {
            console.warn('iframe erişilemedi:', e);
          }
        }
      })();
    `;
    const script = document.createElement('script');
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  }
});
