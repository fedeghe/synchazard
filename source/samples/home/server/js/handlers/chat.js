(function () {
    "use strict";

    var _ID = $NS$.id;

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
        container = document.createElement('div'),
        form = document.createElement('form'),
        input = document.createElement('input'),
        messagesContainer = document.createElement('div'),
        lastMessage = null;

    messagesContainer.className = 'messagesContainer';
    container.className = 'chat';

    form.appendChild(input);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', '...type a message here');

    container.appendChild(form);
    container.appendChild(messagesContainer);
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
                _ACTION: 'new_message',
                _CLIENT: $NS$.id,
                _MESSAGE: v,
                _TIMESTAMP: new Date() + ""
            });
        }
    });
    
    $NS$.handlers.Chat = function (data) {
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
        var messages = data._PAYLOAD;

        switch (data._ACTION) {
            case 'messages': 
                messagesContainer.innerHTML = '';
                messages.all.forEach(function (m) {
                    messagesContainer.appendChild(getLine(m));
                });
                break;
            case 'message': 
                messagesContainer.appendChild(getLine(messages.one));
                break;
        }

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    
    $NS$.handlers.ChatSelfHandler = function (data) {
        var selfMessage = data._PAYLOAD;
        console.log("SELF MESSAGE: " + cleanup(selfMessage));
        $NS$.utils.storage.set('$NS$clientID', _ID);
    };
})();



