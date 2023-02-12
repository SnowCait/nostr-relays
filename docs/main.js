const response = await fetch('https://api.nostr.watch/v1/online', {
  method: 'GET',
});
const relayWebSocketUrls = await response.json();
const relayInformationUrls = relayWebSocketUrls.map(x => x.replace('wss://', 'https://'));
console.log(relayInformationUrls);

const promises = relayInformationUrls.map(async url => {
  console.log(url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/nostr+json',
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`${url} is error.`);
    return null;
  }
});

const relays = await Promise.all(promises);

// UI
const list = document.getElementById('relays');

for (const relay of relays.filter(x => x !== null)) {
  const code = document.createElement('code');
  code.textContent = JSON.stringify(relay, null, 2);
  console.log(code.textContent);

  const pre = document.createElement('pre');
  pre.append(code);

  const item = document.createElement('li');
  item.append(pre);

  list.append(item);
}

document.getElementById('loading').style.display = 'none';
