function test(){
    var body = document.getElementsByTagName('body')[0];
    var newDiv = document.createElement('div');
    var newContent = document.createTextNode('Hi this is new content');

    body.appendChild(newDiv).appendChild(newContent);
}

