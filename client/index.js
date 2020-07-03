// Script that creates an iframe for tracking

document.addEventListener('DOMContentLoaded', () => {
    // Get script tag by id
    const currentScript = document.getElementById('sailnear-js')
    // Get users id to pass as query param
    const userId = currentScript.getAttribute('sailId')

    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `http://localhost:3000/track?userid=${userId}`); // The website to use in the Iframe
    iframe.setAttribute('style', 'display: none;'); // Assign the styles that we declared eariler to the iframe tag

    // Append it to the body
    document.body.appendChild(iframe);
})
