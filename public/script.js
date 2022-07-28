document.getElementById('more-vert')
    .addEventListener('click',()=>{
        document.getElementById('more-vert-effect')
            .style.top='initial'
})
document.getElementById('close')
    .addEventListener('click',()=>{
        document.getElementById('more-vert-effect')
            .style.top='-5000'
})

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})


console.log("working");