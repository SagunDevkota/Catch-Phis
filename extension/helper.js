let script = document.getElementById('mhmpajmoplajebmghhjacjpggnileahk')
let functions = script.innerHTML
functions = functions.split(',')
contents = 1
for (let i = 0;i<functions.length;i++){
    if(window[functions[i]].toString().includes('window.status')){
        contents = -1
    }
}
script.innerHTML = contents