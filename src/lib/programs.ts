// Program definitions for the trace table practice application

export interface Program {
	code: string;
	description: string;
	inputSets?: string[][];
	randomValues?: (number | string)[];
	inputs?: string[];
	randomValue?: number | string;
}

export interface ProgramSet {
	easy: Program[];
	medium: Program[];
	hard: Program[];
}

export const programs: ProgramSet = {
	easy: [
		{
			code: `a = 5
b = 3
c = a + b
print(c)`,
			description: "Basic addition with variables",
		},
		{
			code: `name = input("What's your name?")
print("Hello " + name)`,
			description: "Name input and greeting",
			inputSets: [["Alice"], ["Bob"], ["Charlie"], ["Diana"]],
		},
		{
			code: `name = "Alice"
age = 16
print("Hello " + name)
print("You are " + str(age))`,
			description: "Text and number display",
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
				["90", "10"],
			],
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
			inputSets: [["30"], ["20"], ["15"], ["28"]],
		},
		{
			code: `age = int(input("How old are you?"))
if age < 18 then
    print("You are a student!")
else
    print("You finished school")
endif`,
			description: "Student status checker",
			inputSets: [["16"], ["20"], ["17"], ["25"]],
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
				["7", "6"],
			],
		},
		{
			code: `price = int(input("Enter price"))
discount = price * (10 / 100)
final_price = price - discount
print("Original: £" + str(price))
print("Final: £" + str(final_price))`,
			description: "10% discount calculator",
			inputSets: [["50"], ["100"], ["80"], ["120"]],
		},
		{
			code: `x = 10
y = 20
temp = x
x = y
y = temp
print(x)
print(y)`,
			description: "Variable swapping technique",
		},
		{
			code: `// ASCII for A is 65
letter = "A"
ascii_value = ASC(letter)
print("ASCII value of " + letter + " is " + str(ascii_value))
next_letter = CHR(ascii_value + 1)
print("Next letter is " + next_letter)`,
			description: "ASCII character conversion demo",
		},
		{
			code: `// ASCII for A is 65
start = ASC("A")
for i = 1 to 4
    letter = CHR(start + i)
    print(letter)
next i`,
			description: "Alphabet sequence generator",
		},
		{
			code: `array colours[3]
colours[0] = "Red"
colours[1] = "Blue" 
colours[2] = "Green"
print("First colour: " + colours[0])
print("Last colour: " + colours[2])`,
			description: "Basic array creation and access",
		},
		{
			code: `array scores = [85, 92, 78, 90]
highest = scores[1]
print("Score 1: " + str(scores[0]))
print("Score 2: " + str(scores[1]))
print("Highest so far: " + str(highest))`,
			description: "Array initialization with values",
		},
		{
			code: `array names = ["Alice", "Bob", "Charlie"]
index = 1
current_name = names[index]
print("Student " + str(index) + ": " + current_name)
index = index + 1
current_name = names[index]
print("Student " + str(index) + ": " + current_name)`,
			description: "Array access with variables",
		},
		{
			code: `number = int(input("Enter a number"))
remainder = number MOD 2
if remainder == 0 then
    print(str(number) + " is even")
else
    print(str(number) + " is odd")
endif`,
			description: "Even/odd checker using MOD operator",
			inputSets: [["4"], ["7"], ["10"], ["15"]],
		},
	],
	medium: [
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
			inputSets: [["35"], ["45"], ["40"], ["50"]],
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
				["Sarah", "Wilson"],
			],
		},
		{
			code: `char = input("Enter a character: ")
code = ASC(char)
print("Character: " + char)
print("ASCII code: " + str(code))
if code >= 65 AND code <= 90 then
    print("It's an uppercase letter")
else
    print("It's not an uppercase letter")
endif`,
			description: "Character type checker using ASCII",
			inputSets: [["A"], ["a"], ["E"], ["b"]],
		},
		{
			code: `total = 0
for i = 1 to 3
    total = total + i
    print(total)
next i
print("Final: " + str(total))`,
			description: "Running total in for loop",
		},
		{
			code: `count = 0
while count < 3
    count = count + 1
    print("Count: " + str(count))
endwhile
print("Finished counting")`,
			description: "Counter using while loop",
		},
		{
			code: `for x = 0 to 5
    if x < 3 then
        print("less than 3")
    else
        print("3 or above")
    endif
next x`,
			description: "Number range classifier",
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
			description: "Grade calculator with multiple conditions",
		},
		{
			code: `for x = 1 to 3
    country = "France"
    print(country.substring(x, 1))
next x`,
			description: "Character extraction from text",
		},
		{
			code: `for x = 0 to 2
    choice = input("Enter a word")
    size = input("upper or lower")
    if size == "upper" then
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
				["yes", "upper", "NO", "lower", "maybe", "upper"],
			],
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
				["Tami", "Ann", "Alex"],
				["Jo", "Maxi", "Eve"],
				["Tommy", "Suzy", "Dan"],
			],
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
				["2", "10"],
			],
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
				["5", "10", "2"],
			],
		},
		{
			code: `ducks = int(input("How many ducks are there"))
groups = ducks DIV 4
leftOver = ducks MOD 4
print("Number of groups: " + str(groups))
print("Ducks left over: " + str(leftOver))`,
			description: "Duck grouping with division and remainder",
			inputSets: [["7"], ["3"], ["8"], ["16"], ["13"], ["6"]],
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
				["2.8", "12"],
			],
		},
		{
			code: `longJump = float(input("Enter distance"))
yearGroup = int(input("Enter year group"))
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
				["4.5", "12"],
			],
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
				["Chen", "2022"],
			],
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
				["15", "*", "10", "%", "5", "*", "18", "%"],
			],
		},
		{
			code: `x = 15
y = 0
while x > 0
    y = y + 1
    x = x - y
endwhile
print(y)`,
			description: "Mathematical sequence with decreasing values",
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
				["X", "Y"],
			],
			randomValues: [3, 8, 15, 42, 99],
		},
		{
			code: `day = input("Enter day abbreviation")
switch day:
case "Mon":
    print("Monday")
case "Tue":
    print("Tuesday")
case "Wed":
    print("Wednesday")
default:
    print("Not a weekday")
endswitch`,
			description: "Day name converter using switch/case",
			inputSets: [["Mon"], ["Tue"], ["Wed"], ["Fri"], ["Sun"]],
		},
		{
			code: `grade = input("Enter grade letter")
switch grade:
case "A":
    print("Excellent - 90+ marks")
case "B":
    print("Good - 80+ marks")
case "C":
    print("Pass - 70+ marks")
default:
    print("Below pass level")
endswitch
print("Grade: " + grade)`,
			description: "Grade feedback using switch/case",
			inputSets: [["A"], ["B"], ["C"], ["D"], ["F"]],
		},
		{
			code: `for i = 1 to 3
    colour = input("Enter traffic light colour")
    switch colour:
    case "red":
        print("Stop")
    case "amber":
        print("Get ready")
    case "green":
        print("Go")
    default:
        print("Invalid colour")
    endswitch
next i`,
			description: "Traffic light system with switch/case in loop",
			inputSets: [
				["red", "amber", "green"],
				["green", "red", "amber"],
				["amber", "green", "blue"],
				["red", "yellow", "green"],
			],
		},
		{
			code: `const PI = 3.14159
radius = float(input("Enter radius"))
area = PI * radius * radius
circumference = 2 * PI * radius
print("Radius: " + str(radius))
print("Area: " + str(area))
print("Circumference: " + str(circumference))`,
			description: "Circle calculations using constants",
			inputSets: [["5.0"], ["3.2"], ["10.0"], ["2.5"]],
		},
		{
			code: `const PASS_MARK = 50
total = 0
count = 0
for i = 1 to 3
    score = int(input("Enter test score"))
    total = total + score
    count = count + 1
next i
average = total / count
print("Total: " + str(total))
print("Average: " + str(average))
if average >= PASS_MARK then
    print("PASS")
else
    print("FAIL")
endif`,
			description: "Grade calculator with constants and averaging",
			inputSets: [
				["60", "70", "80"],
				["45", "35", "55"],
				["90", "85", "95"],
				["40", "50", "30"],
			],
		},
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
			description: "Array processing with running totals",
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
				["abc", "parrot"],
				["parrot"],
			],
		},
		{
			code: `max = 0
total = 0
for i = 1 to 4
    num = int(input("Enter number " + str(i)))
    total = total + num
    if num > max then
        max = num
    endif
next i
average = total / 4
print("Maximum: " + str(max))
print("Average: " + str(average))`,
			description: "Track maximum and calculate average from 4 inputs",
			inputSets: [
				["15", "23", "8", "19"],
				["45", "32", "67", "28"],
				["12", "56", "34", "78"],
				["89", "23", "45", "67"],
			],
		},
		{
			code: `array temps[4]
total = 0
const hot = 25
hot_days = 0
for day = 0 to 3
    temp = int(input("Day " + str(day + 1) + " temperature"))
    temps[day] = temp
    total = total + temp
    if temp >= hot then
        hot_days = hot_days + 1
    endif
next day
average = total / 4
print("Daily average: " + str(average))
print("Hot days: " + str(hot_days))`,
			description: "Weather analysis - count days above average",
			inputSets: [
				["18", "22", "25", "19"],
				["15", "15", "20", "18"],
				["25", "28", "21", "30"],
				["12", "15", "13", "12"],
			],
		},
		{
			code: `array products = ["apples", "bananas", "cherries"]
array prices = [3, 5, 2]
total_cost = 0
for i = 0 to 2
    quantity = int(input("How many " + products[i] + "?"))
    cost = quantity * prices[i]
    total_cost = total_cost + cost
next i
print("Total: £" + str(total_cost))
if total_cost > 20 then
    print("You get a discount")
    discount = total_cost * 0.1
    final_cost = total_cost - discount
    print("10% off: £" + str(discount))
    print("Final: £" + str(final_cost))
endif`,
			description: "Shopping cart with discount calculation",
			inputSets: [
				["1", "5", "1"],
				["5", "2", "0"],
				["1", "4", "2"],
				["3", "1", "3"],
			],
		},
		{
			code: `secret = random(1, 50)
attempts = 0
found = false
do
    guess = int(input("Guess the number (1-50)"))
    attempts = attempts + 1
    if guess < secret then
        print("Too low!")
    elseif guess > secret then
        print("Too high!")
    else
        print("Correct!")
        found = true
    endif
until found == true OR attempts >= 3
if found == true then
    print("You won in " + str(attempts) + " attempts!")
else
    print("Game over! The number was " + str(secret))
endif`,
			description: "Number guessing game with attempt limit",
			// Input values may not be realistic for game based on random secret number
			// but are used to demonstrate the program logic
			inputSets: [
				["25", "12", "6"],
				["40", "30", "25"],
				["10", "20", "30"],
				["25", "37", "43"],
				["50", "30", "10"],
				["1", "2", "3"],
			],
			randomValues: [6, 25, 30, 40, 45, 50],
		},
	],
};
