(function () {
    "use strict";

    var ___ID = $NS$.id;

    function cleanup (text, pre) {
        return (pre ? '<pre>' : '') +
            (text
                .replace(/&(?![\w\#]+;)/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
            ) + (pre ? '</pre>' : '');
    }

    var target = document.body,
        form = document.createElement('form'),
        input = document.createElement('input'),
        container = document.createElement('div'),
        lastMessage = null;

    container.setAttribute('id', 'container');

    form.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', '...type a message here');

    target.appendChild(form);
    target.appendChild(container);
    input.focus();
    
    input.addEventListener('keyup', function (e) {
        if (e.keyCode !== 38 || !lastMessage) {return;}
        input.value = lastMessage;
    })
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        lastMessage = input.value;
        
        var v = cleanup(input.value)
            .replace(/&#(\S*)\d;/g, ' ')
            .replace(/&#(\S*)\d/g, ' ');

        input.focus();
        if (v) {
            input.value = '';
            $NS$.send({
                ___TYPE: 'action',
                ___ACTION: 'new_message',
                ___CLIENT: $NS$.id,
                ___MESSAGE: v,
                ___TIMESTAMP: new Date() + ""
            });
        }
    });
    
    $NS$.handlers.Chat = function (messages) {
        function getLine(m){
            var tag = document.createElement('p'),
                user = document.createElement('strong'),
                msg = document.createElement('span'),
                self = m.id === $NS$.id;

            tag.className = 'msg';
            user.innerText = cleanup(m.id) + " : ";
            msg.innerText = cleanup(m.message);
            if (self) {
                tag.className = 'self';
            }
            tag.appendChild(user);
            tag.appendChild(msg);
            return tag;
        }
        if ('all' in messages) {
            container.innerHTML = '';
            messages.all.forEach(function (m){
                container.appendChild(getLine(m));
            });
        } else if('one' in messages) {
            container.appendChild(getLine(messages.one));
        }

        container.scrollTop = container.scrollHeight;
    };
    
    $NS$.handlers.ChatSelfHandler = function (x) {
        console.log("SELF MESSAGE: " + cleanup(x));
        localStorage.setItem('$NS$clientID', ___ID);
    };
})();



