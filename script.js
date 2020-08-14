//THE API STOPPED WORKING AFTER UPLOAD : (

$(document).ready(function () {
    let search = '';
    let lat = '';
    let lon = '';
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let storage = JSON.parse(window.localStorage.getItem('cityHistory')) || [];
    console.log(window.localStorage);

    for (let i = 0; i < storage.length; i++) {
        let item = $('<li>');
        item.addClass('list-group-item list-group-item-action');
        item.text(search);
        $('#cities').append(item);
    }

    if(storage[storage.length] > 0) {
        searchWeather()
    }

    $('#search-button').on('click', function () {
        searchWeather();
    });

    function searchWeather() {
        search = $('#search').val();

//         if(storage.indexOf(search) === -1) {
//             window.localStorage.setItem('cityHistory', JSON.stringify(history));
//             storage.push(search);
//         }

        let searchItem = $('<li>');
        searchItem.addClass('list-group-item list-group-item-action')
        searchItem.text(search);
        $('#cities').append(searchItem);

        $.ajax({
            method: 'GET',
            url: `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=86d1b817982573b9caf5e343ebb87b98&units=imperial`,
        }).then(function (response) {
            console.log(response);
            lat = response.coord.lat;
            lon = response.coord.lon;
            $.ajax({
                method: 'GET',
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=86d1b817982573b9caf5e343ebb87b98&units=imperial`,
            }).then(function (data) {
                console.log(data);
                $('#today').html('');

                todayH1 = $('<h1>');
                todayH1.text(`${response.name}, ${response.sys.country}`)
                todayImg = $('<img>');
                todayImg.attr('src', `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`);
                todayH1.append(todayImg);
                $('#today').append(todayH1);

                tempDiv = $('<div>');
                tempDiv.text(`Temperature: ${data.current.temp}`);
                $('#today').append(tempDiv);

                humDiv = $('<div>');
                humDiv.text(`Humidity: ${data.current.humidity}`);
                $('#today').append(humDiv);

                windDiv = $('<div>');
                windDiv.text(`Wind Speed: ${data.current.wind_speed}`);
                $('#today').append(windDiv);

                uvDiv = $('<div>');
                uvDiv.text(`UV Index: ${data.current.uvi}`);
                $('#today').append(uvDiv);


                $('#forecast').html('');

                for (let i = 0; i < 5; i++) {   
                    today = mm + '/' + dd + '/' + yyyy;

                    let col = $('<div>').addClass('col-2');
                    $('#forecast').append(col);
                    todayH2 = $('<h3>');
                    todayH2.text(today);
                    todayImg = $('<img>');
                    todayImg.attr('src', `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png`);            

                    tempDiv = $('<div>');
                    tempDiv.text(`Temp: ${data.daily[i].temp.day}`);               

                    humDiv = $('<div>');
                    humDiv.text(`Hum: ${data.daily[i].humidity}`);

                    col.append(todayH2);
                    col.append(todayImg);
                    col.append(tempDiv);
                    col.append(humDiv);

                    dd = parseInt(dd)+ 1;
                }
            });
        });
    }
});
