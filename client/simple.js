console.log(SailSession.deviceInfo) // Info about device that user can call

window.addEventListener('load', function () {
    document.getElementById('browser').innerHTML = SailSession.deviceInfo.browser
    document.getElementById('deviceType').innerHTML = SailSession.deviceInfo.deviceType
    document.getElementById('os').innerHTML = SailSession.deviceInfo.os

    // Call API from here
    fetch('http://localhost:5000/api/localhost/Malthe', {
        headers: {
            // 'Content-Type': 'application/json'
            'x-api-key': 'm20-go',
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            document.getElementById('categories').innerHTML = data.categories[0]._id
        });
})


