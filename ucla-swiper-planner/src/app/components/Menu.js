// components/Menu.js
import styles from '../styles/Menu.module.css'; // Ensure this path is correct

const meals = {
    Breakfast: {
        "Bruin Plate": ["Pancakes", "Bacon", "Coffee"],
        "De Neve": ["Oatmeal", "Fruit Salad", "Tea"],
        "The Study at Hedrick": ["Eggs Benedict", "Sausages", "Orange Juice"],
        "Residential Restaurant 1": ["French Toast", "Mixed Berries", "Espresso"],
        "Residential Restaurant 2": ["Bagels with Cream Cheese", "Smoothies", "Cappuccino"]
    },
    Lunch: {
      "Bruin Plate": ["Pancakes", "Bacon", "Coffee"],
      "De Neve": ["Oatmeal", "Fruit Salad", "Tea"],
      "Food Trucks": ["Eggs Benedict", "Sausages", "Orange Juice"],
      "Rendevous East": ["French Toast", "Mixed Berries", "Espresso"],
      "Rendevous West": ["Bagels with Cream Cheese", "Smoothies", "Cappuccino"]
    },
    Dinner: {
      "Bruin Plate": ["Pancakes", "Bacon", "Coffee"],
      "De Neve": ["Oatmeal", "Fruit Salad", "Tea"],
      "Epicuria": ["Eggs Benedict", "Sausages", "Orange Juice"],
      "Food Trucks": ["French Toast", "Mixed Berries", "Espresso"],
      "Feast at Reiber": ["Bagels with Cream Cheese", "Smoothies", "Cappuccino"]
    }
};

const Menu = () => {
    return (
        <div className={styles.menu}>
            <h2 className={styles.menuTitle}>Menu of the Day</h2>
            {Object.entries(meals).map(([mealType, diningOptions]) => (
                <div key={mealType} className={styles.mealSection}>
                    <h3>{mealType}</h3>
                    {Object.entries(diningOptions).map(([diningName, menuItems]) => (
                        <div key={diningName}>
                            <h4>{diningName}</h4>
                            <ul>
                                {menuItems.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Menu;
