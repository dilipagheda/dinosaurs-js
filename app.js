
// Create Dino Constructor
function Dino(info)
{
    this.species= info.species,
    this.weight= info.weight,
    this.height= info.height,
    this.diet= info.diet,
    this.where= info.where,
    this.when= info.when,
    this.fact= info.fact,
    this.imageName = info.imageName
}

// Create Dino Compare Method  - weight
// NOTE= Weight in JSON file is in lbs, height in inches. 
Dino.prototype.compareWeight = function(humanWeight) {
    if(this.weight > humanWeight) {
        return `${this.species} is heaviour than you!`
    }else if(this.weight < humanWeight) {
        return `${this.species} is lighter than you!`
    }else {
        return `${this.species} is of same weight as you!`
    }
}

// Create Dino Compare Method - height
Dino.prototype.compareHeight = function(humanHeight) {
    if(this.height > humanHeight) {
        return `${this.species} is taller than you!`
    }else if(this.height < humanHeight) {
        return `${this.species} is shorter than you!`
    }else {
        return `${this.species} is of same height as you!`
    }
}

// Create Dino Compare Method - diet
Dino.prototype.compareDiet = function(humanDiet) {
    if(this.diet === humanDiet) {
        return `${this.species} is ${this.diet} too!!. Just like you!`
    }else {
        return `${this.species} is ${this.diet}!`
    }
}

//Method to get the random fact
Dino.prototype.getRandomFact = function(humanInfo)
{
    if(this.species === 'Pigeon') {
        return this.fact
    }else if(this.species === 'human') {
        return `This is YOU!`
    }else {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        switch(randomNumber) {
            case 1:
                return this.compareWeight(humanInfo.weight)
            case 2:
                return this.compareHeight(humanInfo.height)
            case 3:
                return this.compareDiet(humanInfo.diet)
            case 4:
                return `I used to live in ${this.where}`
            case 5:
                return `I used to be alive back in ${this.when}`
            case 6:
                return this.fact
        }
    }
}

//Method to get html div from the data
Dino.prototype.renderHtml = function(humanInfo) {
    const header = this.species === 'human' ? this.name : this.species
    return `
        <div class="grid-item">
            <img src="./images/${this.imageName}" alt="">
            <div class="fact">
                <div>${header}</div>
                <div>${this.getRandomFact(humanInfo)}</div>
            </div>
        </div>
    `;
}

// Use IIFE to get human data from form
const getHumanData = (function(){
    function getName() {
        const name = document.getElementById('name').value
        if(name)
        {
            return name
        }else {
            return ""
        }
    }
    function getHeight() {
        let feetInput = document.getElementById('feet').value
        if(feetInput.length === 0) {
            feetInput = 0
            document.getElementById('feet').value = feetInput
        }
        const feet = parseInt(feetInput)
        if(Number.isNaN(feet))
        {
            return 0
        }

        let inchesInput = document.getElementById('inches').value
        if(inchesInput.length === 0) {
            inchesInput = 0
            document.getElementById('inches').value = inchesInput
        }
        const inches = parseInt(inchesInput)
        if(Number.isNaN(inches))
        {
            return 0
        }
        return (feet*12) + inches
    }
    function getWeight() {
        let weightInput = document.getElementById('weight').value
        if(weightInput.length === 0) {
            weightInput = 0
            document.getElementById('weight').value = weightInput
        }        
        const weight = parseInt(weightInput)
        if(Number.isNaN(weight))
        {
            return 0
        }
        return weight
    }
    function getDiet() {
        const diet = document.getElementById('diet').value
        return diet.toLowerCase()
    }
    function createInfo() {
        return {
            name: getName(),
            height: getHeight(),
            weight: getWeight(),
            diet: getDiet()
        }
    }
    function checkValidity(){
       const info = createInfo();
       let isValid = true
       isValid = isValid && info.name.length > 0
       isValid = isValid && info.height > 0
       isValid = isValid && info.weight > 0
       isValid = isValid && info.diet.length > 0
       return isValid
    }

    return function(){
        return {
            isValid : checkValidity(),
            info: createInfo()
        }
    }
})()


// Generate Tiles for each Dino in Array
const Tiles = (function() {
    // Create Dino Objects
    function generateDinoArray(jsonDinos) {
        const dinoArray = jsonDinos.Dinos.map(function(dino) { 
            return new Dino(dino)
        })
        return dinoArray
    }
    // Create Human Object
    function createHuman(name, weight, height, diet)
    {
        const humanObj = {
            name: name,
            species: 'human',
            imageName: 'human.png',
            weight: weight,
            height: height,
            diet: diet
        }
        return Object.assign(Object.create(Dino.prototype),humanObj)
    }    
    function toHtml(dinoData, humanInfo) {
        const allObjects = []
        const dinoObjects = generateDinoArray(dinoData)
        dinoObjects.forEach(function(dino){
            allObjects.push(dino)
        })
        allObjects.splice(4,0, createHuman(humanInfo.name, humanInfo.weight, humanInfo.height, humanInfo.diet))
        
        const htmlOutput = allObjects.map(function(obj) {
            return obj.renderHtml(humanInfo)
        }).join(' ')
        return htmlOutput
    }
    return {
        toHtml: toHtml
    }

})()

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener('click', function(event){
    event.preventDefault()
    const humanData = getHumanData()
    if(!humanData.isValid) {
        alert("Oops! It seems that some data in not valid. \n(1) Name can not be empty \n(2) Height and Weight should be numbers and greather than 0 \n(3) Diet can not be empty")
        return
    }
    // Add tiles to DOM
    document.getElementById("grid").innerHTML = Tiles.toHtml(dinoData, humanData.info)

    // Remove form from screen
    const formElement = document.getElementById("dino-compare")
    formElement.remove()
})