import re
import os
import requests
import json
import datetime
from bs4 import BeautifulSoup
from unidecode import unidecode

def condense_whitespace(input_text):
    # Change whitespace so that each line is simply a dining hall and whatnot
    condensed_text = re.sub(r'(Contains.*|Prepared.*|Vegan Menu Option|Vegetarian Menu Option|Halal Menu Option|Low Carbon Footprint)|', '', input_text)
    condensed_text = re.sub(r' {2,}', ' ', input_text)
    condensed_text = re.sub(r'\n{3,}', '\n\n', condensed_text)
    condensed_text = re.sub(r'([^\S\n])\s+', r'\1', condensed_text)
    
    return condensed_text
    
def clean_menu(menu_string):
    # Removed menu's sublocation so the menu isnt cluttered
    words_to_remove = ['Capri', 'Mezze', 'Flex', 'bar', 'Psistaria', 'Alimenti', 
                       'Kitchen', 'Pizzeria', 'Grill', 'Freshly', 'Bowled', 
                       'Harvest', 'Stone', 'Oven', 'Simply', 'Grilled', 'Front', 'The']
    
    lines = menu_string.split('\n')
    cleaned_lines = []
    for line in lines: #removing extraneous information origin doesnt work to remove idk why, but that seems to be a one time occurance
        if not any(phrase in line for phrase in ['Vegan Menu Option', 'Vegetarian Menu Option', 'Halal Menu Option', 'Low Carbon Footprint', 'Prepared', 'Detailed Menu', 'High Carbon Footprint' , 'Activity Level', '\'', 'Origin/inspiration:']) and 'Contains' not in line:
            cleaned_line = ' '.join(word for word in line.split() if not any(remove_word in word for remove_word in words_to_remove)) #removing words to delete and putting each line into new entries
            cleaned_lines.append(cleaned_line)
    
    cleaned_menu = '\n'.join(' '.join(word.capitalize() for word in line.strip().split()) for line in cleaned_lines if line.strip()) #capiutalzing and removing extraneous whitesapce on the edges
    
    return cleaned_menu

def fetch_menu_items_html(date): #should be pretty obvious
    url = f'https://menu.dining.ucla.edu/Menus/{date}/'
    response = requests.get(url)
    if response.status_code == 200:
        return response.content
    else:
        print(f"Failed to fetch menu for {date}")
        return None

def parse_menu_items(html_content):
    soup = BeautifulSoup(html_content, 'lxml') #delcare betiful soup
    allMenus = []
    h2Tags = soup.find_all('h2', id='page-header') #h2 is important as it is right above where the menus for each location/time are

    for i in range(3): #for 3 location
        if h2Tags and i < len(h2Tags):
            for sibling in h2Tags[i].find_next_siblings(): #every item under the h2 is part of the menu, reaching the next h2 means we are on the enxt menu
                if sibling.name == 'h2' or sibling.name == 'hr':
                    break
                allMenus.append(sibling)

    menu_map = {'Epicuria': {'Breakfast': [], 'Lunch': [], 'Dinner': []}, #this is the format we want the json to be
                'De Neve': {'Breakfast': [], 'Lunch': [], 'Dinner': []},
                'Bruin Plate': {'Breakfast': [], 'Lunch': [], 'Dinner': []}}

    current_hall = None
    current_meal = None

    for menu in allMenus:
        text_menu = unidecode(menu.text.strip()) #we don't want unicode characters
        no_whitespace_menu = condense_whitespace(text_menu) #calling our funtions to clean the text
        clean_menu_text = clean_menu(no_whitespace_menu)

        lines = clean_menu_text.split('\n')
        for line in lines:
            if 'Detailed Breakfast Menu' in line:
                current_meal = 'Breakfast'
                continue
            elif 'Detailed Lunch Menu' in line:
                current_meal = 'Lunch'
                continue
            elif 'Detailed Dinner Menu' in line:
                current_meal = 'Dinner'
                continue
            
            hall_name = line.strip()
            if hall_name in menu_map:
                current_hall = hall_name
            elif current_meal and current_hall:
                # Split line into potential menu items
                potential_items = line.split(',') 
                menu_items = []
                for item in potential_items: #INMPORATN!!! Normally in the formating of Pizza, Potatoes, etc. but if ONE menu item has a comma we need this so it doesn't become multiple items
                    # Check if the item is wrapped in quotes
                    capitalized_item = ' '.join(word.capitalize() for word in item.strip().split())
                    if item.startswith('"') and item.endswith('"'):
                        menu_items.append(item.strip('"'))
                    else:
                        # Combine with the previous item if it doesn't end with a quote
                        if menu_items:
                            menu_items[-1] += f',{item}'
                        else:
                            menu_items.append(item)
                menu_map[current_hall][current_meal].extend(menu_items)
    
    print(menu_map) #KEY POINT
    return menu_map



def write_menu_to_json(menu_data, date):
    formatted_menus = {
        "Breakfast": {},
        "Lunch": {},
        "Dinner": {}
    }

    halls_to_check = ["Epicuria", "De Neve", "Bruin Plate"]

    # Loop through each meal period
    for meal_period in formatted_menus.keys():
        # Loop through each hall
        for hall_name, menu in menu_data.items():
            # If the hall is in the halls to check and it's empty for the current meal period, mark it as "Closed"
            if hall_name in halls_to_check and not menu[meal_period]:
                formatted_menus[meal_period][hall_name] = ["Closed"]
            else:
                formatted_menus[meal_period][hall_name] = menu[meal_period]

    # Format the date for the filename
    formatted_date = date.strftime("%Y-%m-%d")

    # Create the directory if it doesn't exist
    directory = "./ucla-swiper-planner/src/app/DailyMenu"
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Write the menu data to a JSON file
    filename = os.path.join(directory, f"menu_{formatted_date}.json")
    with open(filename, 'w') as json_file:
        json.dump(formatted_menus, json_file, indent=4)


# Loop through the next 7 days
for i in range(7):
    deltaDay = datetime.date.today() + datetime.timedelta(days=i)
    html_content = fetch_menu_items_html(deltaDay)
    if html_content:
        try:
            menu_info = parse_menu_items(html_content) 
            write_menu_to_json(menu_info, deltaDay)
            print(f"Menu for {deltaDay} saved successfully.")
        except Exception as e:
            print(f"Error processing menu for {deltaDay}: {e}")
    else:
        print(f"No menu content available for {deltaDay}.")