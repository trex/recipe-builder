import json

data_dir = 'src/app/data/'

# Safe fruits and vegetables
SAFE_PLANT_KEYWORDS = [
    "carrot", "blueberry", "apple", "pumpkin", "sweet potato",
    "green bean", "zucchini", "pea", "spinach", "broccoli", "kale",
    "avocado", "rosemary", "peach", "cherries", "apricot", "walnut",
    "almond", "pecan", "mushroom", "garlic", "peanut", "sunflower seed",
    "pumpkin seed"
]

# Safe broad food groups
SAFE_GROUPS = [
    "Meat", "Poultry", "Seafood", "Dairy", "Egg", "Vegetable", "Fruit", "Nuts/Seeds", "Grain", "Oil"
]

# Words indicating heavy processing we want to exclude
EXCLUDED_KEYWORDS = [
    "baked", "fried", "breaded", "snack", "confectionery", "candy", "chips", "juice"
]

def is_suitable(food):
    group = food.get('group', '').lower()
    label = food.get('label', '').lower()
    protein = food.get('protein', 0)

    # Always allow specific safe fruits/veggies
    if any(plant in label for plant in SAFE_PLANT_KEYWORDS):
        return True

    # Allow based on safe groups
    if any(group_name.lower() in group for group_name in SAFE_GROUPS):
        # Exclude if obviously heavily processed
        if any(word in label for word in EXCLUDED_KEYWORDS):
            print(f"Excluded '{food['label']}' due to processing keywords.")
            return False
        # For animal products, check minimum protein
        if group in ['meat', 'poultry', 'seafood', 'dairy', 'egg']:
            if protein < 5:
                print(f"Excluded '{food['label']}' due to low protein ({protein}g).")
                return False
        return True

    # Everything else is excluded
    print(f"Excluded '{food['label']}' due to unsuitable group: '{group}'.")
    return False

def filter_suitable_foods(input_file, output_file):
    with open(input_file, 'r') as f:
        data = json.load(f)

    suitable = []
    excluded_count = 0

    for food in data:
        if is_suitable(food):
            suitable.append(food)
        else:
            excluded_count += 1

    with open(output_file, 'w') as f:
        json.dump(suitable, f, indent=2)

    print(f"\nFinished filtering:")
    print(f"  {len(suitable)} items suitable.")
    print(f"  {excluded_count} items excluded.")

if __name__ == "__main__":
    filter_suitable_foods(
        input_file=f"{data_dir}foundationFoodsSimplified.json",
        output_file=f"{data_dir}petSuitableIngredients.json"
    )
