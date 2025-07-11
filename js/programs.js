// Program definitions for the trace table practice application
export const programs = {
    easy: [
        {
            code: `a = 5
b = 3
c = a + b
print(c)`,
            description: "Simple arithmetic"
        },
        {
            code: `name = "Alice"
age = 16
print("Hello " + name)
print("You are " + str(age))`,
            description: "String concatenation"
        },
        {
            code: `x = 10
y = 20
temp = x
x = y
y = temp
print(x)
print(y)`,
            description: "Variable swapping"
        },
        {
            code: `name = input("What's your name?")
print("Hello " + name)`,
            description: "Simple input and output",
            inputSets: [
                ["Alice"],
                ["Bob"],
                ["Charlie"],
                ["Diana"]
            ]
        },
        {
            code: `age = int(input("How old are you?"))
if age < 18 then
    print("You are a student!")
else
    print("You finished school")
endif`,
            description: "Age checker with conditions",
            inputSets: [
                ["16"],
                ["20"],
                ["17"],
                ["25"]
            ]
        },
        {
            code: `test1 = int(input("What score?"))
test2 = int(input("What score?"))
total = test1 + test2
print("You got " + str(total))`,
            description: "Adding two test scores",
            inputSets: [
                ["75", "82"],
                ["90", "88"],
                ["65", "70"],
                ["95", "92"]
            ]
        },
        {
            code: `price = int(input("Enter price"))
discount = price * (10 / 100)
final_price = price - discount
print("Original: " + str(price))
print("Final: " + str(final_price))`,
            description: "Calculate 10% discount",
            inputSets: [
                ["50"],
                ["100"],
                ["80"],
                ["120"]
            ]
        },
        {
            code: `length = int(input("Length"))
width = int(input("Width"))
area = length * width
perimeter = 2 * (length + width)
print("Area: " + str(area))
print("Perimeter: " + str(perimeter))`,
            description: "Rectangle calculations",
            inputSets: [
                ["5", "3"],
                ["10", "8"],
                ["12", "4"],
                ["7", "6"]
            ]
        },
        {
            code: `temperature = int(input("Temperature in Celsius"))
if temperature > 25 then
    print("It's warm today")
else
    print("It's cool today")
endif
print(str(temperature) + " degrees C")`,
            description: "Temperature feedback with condition",
            inputSets: [
                ["30"],
                ["20"],
                ["15"],
                ["28"]
            ]
        },
        {
            code: `hours = int(input("Hours worked"))
rate = 10
pay = hours * rate
if hours > 40 then
    bonus = 50
    pay = pay + bonus
    print("Bonus earned!")
endif
print("Total pay: " + str(pay))`,
            description: "Pay calculator with bonus",
            inputSets: [
                ["35"],
                ["45"],
                ["40"],
                ["50"]
            ]
        },
        {
            code: `first_name = input("First name")
last_name = input("Last name")
full_name = first_name + " " + last_name
initials = first_name.left(1) + last_name.left(1)
print("Full name: " + full_name)
print("Initials: " + initials)`,
            description: "Name processing with string methods",
            inputSets: [
                ["John", "Smith"],
                ["Emma", "Jones"],
                ["Alex", "Brown"],
                ["Sarah", "Wilson"]
            ]
        }
    ],
    medium: [
        {
            code: `total = 0
for i = 1 to 3
    total = total + i
    print(total)
next i
print("Final: " + str(total))`,
            description: "For loop with accumulator"
        },
        {
            code: `count = 0
while count < 3
    count = count + 1
    print("Count: " + str(count))
endwhile
print("Finished counting")`,
            description: "While loop with counter"
        },
        {
            code: `score = 75
if score >= 90 then
    print("Grade A")
elseif score >= 70 then
    print("Grade B")
else
    print("Grade C")
endif
print("Score: " + str(score))`,
            description: "If-elseif-else statements"
        },
        {
            code: `surname = input("Enter surname")
year = input("Enter starting year")
staffID = surname + str(year)
while staffID.length < 10
    staffID = staffID + "x"
endwhile
print("ID " + staffID)`,
            description: "Staff ID generator with input",
            inputSets: [
                ["Kofi", "2021"],
                ["Smith", "2023"],
                ["Lee", "2020"],
                ["Brown", "2024"]
            ]
        },
        {
            code: `x = 15
y = 0
while x > 0
    y = y + 1
    x = x - y
endwhile
print(y)`,
            description: "While loop with variable decrement"
        },
        {
            code: `a = input("Enter first letter of first name")
b = input("Enter first letter of second name")
c = random(1,100)
while c < 100
    c = c * 10
endwhile
pilotCode = a + b + str(c)
print(pilotCode)`,
            description: "Pilot code generator with random",
            inputSets: [
                ["S", "T"],
                ["A", "B"],
                ["J", "M"],
                ["K", "R"]
            ],
            randomValues: [4, 7, 12, 25, 50]
        },
        {
            code: `jumpLength = input("Enter jump length")
yearGroup = input("Enter year group")
if jumpLength > 2 then
    if yearGroup >= 10 then
        print("You qualify for the team")
    else
        print("You are too young")
    endif
else
    print("Jump not long enough")
endif`,
            description: "Long jump qualification",
            inputSets: [
                ["2.5", "9"],
                ["3.1", "11"],
                ["1.8", "10"],
                ["2.2", "8"]
            ]
        },
        {
            code: `longJump = input("Enter distance")
yearGroup = input("Enter year group")
if longJump >= 5.0 then
    score = 3
elseif longJump >= 3.0 then
    score = 2
else
    score = 1
endif
if yearGroup != 10 then
    score = score * 2
endif
print("The score is", score)`,
            description: "Long jump scoring system",
            inputSets: [
                ["2.5", "9"],
                ["5.2", "10"],
                ["3.8", "11"],
                ["1.9", "8"]
            ]
        },
        {
            code: `for x = 0 to 2
    print(x*2)
next x`,
            description: "For loop with multiplication"
        },
        {
            code: `for x = 0 to 5
    if x < 3 then
        print("less than 3")
    else
        print("3 or above")
    endif
next x`,
            description: "For loop with conditional output"
        },
        {
            code: `for x = 0 to 2
    choice = input("Enter a word")
    case = input("upper or lower")
    if case == "upper" then
        print(choice.upper)
    else
        print(choice.lower)
    endif
next x`,
            description: "For loop with string methods",
            inputSets: [
                ["hello", "upper", "world", "lower", "test", "upper"],
                ["cat", "lower", "DOG", "upper", "fish", "lower"],
                ["APPLE", "lower", "banana", "upper", "Orange", "lower"],
                ["yes", "upper", "NO", "lower", "maybe", "upper"]
            ]
        },
        {
            code: `for x = 1 to 3
    country = "France"
    print(country[x])
next x`,
            description: "Array indexing with string"
        },
        {
            code: `for x = 1 to 4
    if x < 3 then
        print("it's Jeff")    
    else
        num = int(input("Enter a number"))
        print(x * num)
    endif
next x`,
            description: "For loop with conditional input",
            inputSets: [
                ["5", "8"],
                ["3", "10"],
                ["7", "4"],
                ["2", "6"]
            ]
        },
        {
            code: `for x = 1 to 3
    name = input("Enter a name")
    length = name.length
    print(x * length)
next x`,
            description: "For loop with string length calculation",
            inputSets: [
                ["Alice", "Bob", "Charlie"],
                ["Sam", "Jennifer", "Alex"],
                ["Jo", "Michael", "Diana"],
                ["Max", "Catherine", "Tom"]
            ]
        },
        {
            code: `for x = 1 to 3
    country = "United Kingdom"     
    num = int(input("Enter a number"))
    letter = country[num]
    print(country[x] + letter)
next x`,
            description: "For loop with string indexing",
            inputSets: [
                ["2", "5", "8"],
                ["0", "7", "3"],
                ["4", "1", "9"],
                ["6", "10", "2"]
            ]
        },
        {
            code: `for x = 1 to 4
    num = int(input("Enter a number"))
    operator = input("Enter operator")
    if operator == "%" then
        print(num MOD x)
    else
        print(num*x)
    endif
next x`,
            description: "For loop with operator selection",
            inputSets: [
                ["10", "%", "15", "*", "8", "%", "20", "*"],
                ["12", "*", "8", "%", "14", "*", "6", "%"],
                ["16", "%", "10", "*", "6", "%", "15", "*"],
                ["14", "*", "16", "%", "5", "*", "20", "%"]
            ]
        },
        {
            code: `ducks = int(input("How many ducks are there"))
groups = ducks DIV 4
leftOver = ducks MOD 4
print("Number of groups: " + str(groups))
print("Ducks left over: " + str(leftOver))`,
            description: "Duck grouping with MOD and DIV operators",
            inputSets: [
                ["15"],
                ["22"],
                ["8"],
                ["13"],
                ["20"],
                ["7"]
            ]
        }
    ],
    hard: [
        {
            code: `array nums[3]
nums[0] = 10
nums[1] = 20
nums[2] = 30
total = 0
for i = 0 to 2
    total = total + nums[i]
    print("Sum so far: " + str(total))
next i
print("Average: " + str(total / 3))`,
            description: "Array processing"
        },
        {
            code: `do
    x = input("Password: ")
    print("You guessed " + x)
until x == "parrot"
print("Correct!")`,
            description: "Do-until loop with password check",
            inputSets: [
                ["hello", "123", "parrot"],
                ["password", "parrot"],
                ["wrong", "guess", "test", "parrot"],
                ["abc", "parrot"]
            ]
        }
    ]
};
