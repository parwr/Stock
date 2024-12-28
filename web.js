
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const ip = data.ip;

                // جلب معلومات الموقع بناءً على IP باستخدام ipinfo.io
                fetch(`https://ipinfo.io/${ip}/json`)
                    .then(response => response.json())
                    .then(locationData => {
                        const country = locationData.country || "Unknown";
                        
                        if (country === "Unknown") {
                            console.error('مشكلة في تحديد البلد.');
                        } else {
                            console.log('Country:', country);
                            
                            // إرسال البيانات إلى Google Sheets
                            const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbxKiyrOGeCKqmHgxz3B4zp1idwY0dtLm8Y1xZRuGLmpVzqRF2POWVizHrJCUqBTvDEh/exec';
                            const params = new URLSearchParams();
                            params.append('ip', ip);
                            params.append('country', country);

                            fetch(googleSheetUrl, {
                                method: 'POST',
                                body: params,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                            })
                            .then(response => response.text())
                            .then(result => {
                                console.log('Data saved:', result);
                            })
                            .catch(error => console.error('Error sending data:', error));
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching location data from ipinfo.io:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching IP:', error);
            });
   
