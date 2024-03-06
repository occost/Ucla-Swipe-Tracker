// app/page/index.page.

// Components
import styles from './styles/Home.module.css'; // Make sure to have this CSS file for styling
import Menu from './components/Menu';
import {getAuth} from "firebase/auth"
import {initFirebase} from "../../firebase/firebaseApp"
import {useRouter} from "next/navigation"
import { useAuthState } from 'react-firebase-hooks/auth';
// Mock data, assuming you would replace this with real data fetched from the backend
const mockTotalSwipesUsed = 120;
const mockWeeklySwipesUsed = 15;
const totalWeeks = 10;
const swipesPerWeek = 19;
const totalSwipesAvailable = totalWeeks * swipesPerWeek;
const currentWeek = 9;
const currentDay = 1;

export default function Home() {
    const app = initFirebase()
    const auth= getAuth();
    const router = useRouter();
    const [totalSwipesUsed, setTotalSwipesUsed] = useState(mockTotalSwipesUsed);
    const [weeklySwipesUsed, setWeeklySwipesUsed] = useState(mockWeeklySwipesUsed);
    const [user, loading] = useAuthState(auth);

    useEffect(() => {
        // Here, you would fetch the actual swipe data from your backend
        // For demonstration, we're using mock data
        // Example:
        // fetch('/api/swipe-data').then(res => res.json()).then(data => {
        //     setTotalSwipesUsed(data.total);
        //     setWeeklySwipesUsed(data.weekly);
        // });
    }, []);

    if (loading){
        return <div>Currently Loading D:</div>;
    }
    
    if (!user){
        router.push("/signIn")
        return <div>Currently Loading D:</div>;
    }  
    const onTrack = (totalSwipesUsed / totalSwipesAvailable) <= (1 / totalWeeks);

    return (
            <><div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-md shadow-lg w-96">
                <button onClick={()=> auth.signOut()}
                    className="w-full bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </div><div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>Welcome to UCLA Swipe Planner!</h1>
                    <div className={styles.swipeTracker}>
                        <h2>Swipe Tracker</h2>
                        <p>Total Swipes Used: {totalSwipesUsed}</p>
                        <p>This Week's Swipes: {weeklySwipesUsed}</p>
                    </div>

                    <div className={styles.balanceInfo}>
                        <h2>Meal Swipe Balance</h2>
                        <p>You have {totalSwipesAvailable - totalSwipesUsed} swipes remaining.</p>
                        <p>You should have {totalSwipesAvailable - ((currentWeek * swipesPerWeek) - (currentDay * 3))} swipes remaining.</p>
                        <p>You are {onTrack ? "on track" : "not on track"} with your meal swipe balance.</p>
                    </div>
                    <Menu />
                </main>
            </div></>
    );
}
