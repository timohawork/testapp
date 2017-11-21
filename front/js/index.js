$(document).ready(() => {
    // TODO: add login form
    var user = {
        login: 'admin',
        password: '123456',
        token: ''
    };

    $('body').hide();

    $.ajax({
        url: '/index/auth',
        method: 'POST',
        data: {
            login: user.login,
            password: user.password
        },
        success: res => {
            if (!res || res.error || !res.token) {
                console.error('Auth error:', res.error);
                return;
            }

            console.log('Auth success!');
            user.token = res.token;
            $('.token').val(user.token);
            $('body').show();
        }
    });
});