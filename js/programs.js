// Program definitions for the trace table practice application
export const programs = {
    easy: [
        {
            code: `a = 5
b = 3
c = a + b
print(c)`,
            description: "Basic addition with variables"
        },
        {
            code: `name = input("What's your name?")
print("Hello " + name)`,
            description: "Name input and greeting",
            inputSets: [
                ["Alice"],
                ["Bob"],
                ["Charlie"],
                ["Diana"]
            ]
        },
        {
            code: `name = "Alice"
age = 16
print("Hello " + name)
print("You are " + str(age))`,
            description: "Text and number display"
        },
        {
            code: `test1 = int(input("What score?"))
test2 = int(input("What score?"))
total = test1 + test2
print("You got " + str(total))`,
            description: "Test score calculator",
            inputSets: [
                ["70", "25"],
                ["80", "15"],
                ["60", "30"],
                ["90", "10"]
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
            description: "Weather checker based on temperature",
            inputSets: [
                ["30"],
                ["20"],
                ["15"],
                ["28"]
            ]
        },
        {
            code: `age = int(input("How old are you?"))
if age < 18 then
    print("You are a student!")
else
    print("You finished school")
endif`,
            description: "Student status checker",
            inputSets: [
                ["16"],
                ["20"],
                ["17"],
                ["25"]
            ]
        },
        {
            code: `length = int(input("Length"))
width = int(input("Width"))
area = length * width
perimeter = 2 * (length + width)
print("Area: " + str(area))
print("Perimeter: " + str(perimeter))`,
            description: "Rectangle area and perimeter calculator",
            inputSets: [
                ["5", "3"],
                ["10", "8"],
                ["12", "4"],
                ["7", "6"]
            ]
        },
        {
            code: `price = int(input("Enter price"))
discount = price * (10 / 100)
final_price = price - discount
print("Original: " + str(price))
print("Final: " + str(final_price))`,
            description: "10% discount calculator",
            inputSets: [
                ["50"],
                ["100"],
                ["80"],
                ["120"]
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
            description: "Overtime pay calculator",
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
            description: "Name formatter with initials",
            inputSets: [
                ["John", "Smith"],
                ["Emma", "Jones"],
                ["Alex", "Brown"],
                ["Sarah", "Wilson"]
            ]
        },
        {
            code: `x = 10
y = 20
temp = x
x = y
y = temp
print(x)
print(y)`,
            description: "Variable swapping technique"
        }
    ],
    medium: [
        {
            code: `for x = 0 to 2
    print(x*2)
next x`,
            description: "Simple multiplication table"
        },
        {
            code: `total = 0
for i = 1 to 3
    total = total + i
    print(total)
next i
print("Final: " + str(total))`,
            description: "Running total in for loop"
        },
        {
            code: `count = 0
while count < 3
    count = count + 1
    print("Count: " + str(count))
endwhile
print("Finished counting")`,
            description: "Counter using while loop"
        },
        {
            code: `for x = 0 to 5
    if x < 3 then
        print("less than 3")
    else
        print("3 or above")
    endif
next x`,
            description: "Number range classifier"
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
            description: "Grade calculator with multiple conditions"
        },
        {
            code: `for x = 1 to 3
    country = "France"
    print(country.substring(x, 1))
next x`,
            description: "Character extraction from text"
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
            description: "Text case converter",
            inputSets: [
                ["hello", "upper", "world", "lower", "test", "upper"],
                ["cat", "lower", "DOG", "upper", "fish", "lower"],
                ["APPLE", "lower", "banana", "upper", "Orange", "lower"],
                ["yes", "upper", "NO", "lower", "maybe", "upper"]
            ]
        },
        {
            code: `for x = 1 to 3
    name = input("Enter a name")
    length = name.length
    print(x * length)
next x`,
            description: "Name length multiplier",
            inputSets: [
                ["Alice", "Bob", "Kate"],
                ["Sam", "Ann", "Alex"],
                ["Jo", "Max", "Eve"],
                ["Tom", "Sue", "Dan"]
            ]
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
            description: "Conditional input with multiplication",
            inputSets: [
                ["5", "6"],
                ["3", "8"],
                ["7", "4"],
                ["2", "10"]
            ]
        },
        {
            code: `for x = 1 to 3
    country = "United Kingdom"     
    num = int(input("Enter a number"))
    letter = country.substring(num, 1)
    print(letter)
next x`,
            description: "Character picker by position",
            inputSets: [
                ["2", "5", "8"],
                ["0", "7", "3"],
                ["1", "4", "9"],
                ["6", "10", "2"]
            ]
        },
        {
            code: `ducks = int(input("How many ducks are there"))
groups = ducks DIV 4
leftOver = ducks MOD 4
print("Number of groups: " + str(groups))
print("Ducks left over: " + str(leftOver))`,
            description: "Duck grouping with division and remainder",
            inputSets: [
                ["7"],
                ["3"],
                ["8"],
                ["16"],
                ["13"],
                ["6"]
            ]
        },
        {
            code: `jumpLength = float(input("Enter jump length"))
yearGroup = float(input("Enter year group"))
if jumpLength > 2 then
    if yearGroup >= 10 then
        print("You qualify for the team")
    else
        print("You are too young")
    endif
else
    print("Jump not long enough")
endif`,
            description: "Sports team qualification checker",
            inputSets: [
                ["2.5", "9"],
                ["3.1", "11"],
                ["1.8", "10"],
                ["2.2", "8"],
                ["2.8", "12"]
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
            description: "Athletic performance scoring system",
            inputSets: [
                ["2.5", "9"],
                ["5.2", "10"],
                ["3.8", "11"],
                ["1.9", "8"],
                ["4.5", "12"]
            ]
        },
        {
            code: `surname = input("Enter surname")
year = input("Enter starting year")
staffID = surname + str(year)
while staffID.length < 10
    staffID = staffID + "x"
endwhile
print("ID " + staffID)`,
            description: "Staff ID generator with padding",
            inputSets: [
                ["Kofi", "2021"],
                ["Smith", "2023"],
                ["Lee", "2020"],
                ["Brown", "2024"],
                ["Chen", "2022"]
            ]
        },
        {
            code: `for x = 1 to 4
    num = int(input("Enter a number"))
    operator = input("Enter operator")
    if operator == "%" then
        print(num MOD x)
    else
        print(num * x)
    endif
next x`,
            description: "Calculator with modulo and multiplication",
            inputSets: [
                ["10", "%", "12", "*", "8", "%", "15", "*"],
                ["9", "*", "6", "%", "14", "*", "4", "%"],
                ["16", "%", "8", "*", "6", "%", "12", "*"],
                ["15", "*", "10", "%", "5", "*", "18", "%"]
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
            description: "Mathematical sequence with decreasing values"
        },
        {
            code: `initial1 = input("Enter first initial")
initial2 = input("Enter second initial")
num = random(1,99)
while num < 75
    num = num * 10
endwhile
userCode = initial1 + initial2 + str(num)
print(userCode)`,
            description: "Random user code generator",
            inputSets: [
                ["A", "Z"],
                ["M", "K"],
                ["P", "Q"],
                ["X", "Y"]
            ],
            randomValues: [3, 8, 15, 42, 99]
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
            description: "Array processing with running totals"
        },
        {
            code: `do
    x = input("Password: ")
    print("You guessed " + x)
until x == "parrot"
print("Correct!")`,
            description: "Password validation with do-until loop",
            inputSets: [
                ["hello", "123", "parrot"],
                ["password", "parrot"],
                ["wrong", "guess", "test", "parrot"],
                ["abc", "parrot"]
            ]
        }
    ]
};
