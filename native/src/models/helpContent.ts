export type HelpAudience = 'kid' | 'parent';

export interface HelpTopic {
  id: string;
  title: string;
  summary: string;
  detail: string;
  audience: HelpAudience;
}

export const KID_HELP_TOPICS: HelpTopic[] = [
  {
    id: 'kid-pet',
    title: '🐾 Your Pet',
    summary: 'Meet your creature and keep it happy!',
    detail:
      'Your pet is the star of HabitHatch! Every kid gets their own creature to take care of. ' +
      'You can see how your pet is feeling by looking at its face — a big smile means happy, a frown means it needs attention. ' +
      'The heart bar at the bottom shows your pet\'s health. Keep it full by doing chores and feeding your pet every day. ' +
      'If the health bar goes all the way down, your pet gets very sad, so check in often!',
    audience: 'kid',
  },
  {
    id: 'kid-feed',
    title: '🍲 Feeding Your Pet',
    summary: 'Spend coins to feed your creature yummy food.',
    detail:
      'Tap the Feed button to open the food menu. Pick a food to feed your pet — it will show a fun message and feel better right away! ' +
      'Feeding costs coins 💰. If you don\'t have enough coins, the Feed button will be greyed out. ' +
      'Earn coins by completing your chores. ' +
      'Your pet gets hungry over time, so try to feed it every day to keep it healthy and happy!',
    audience: 'kid',
  },
  {
    id: 'kid-points-coins',
    title: '💰 Points & Coins',
    summary: 'Earn points and coins by doing your chores.',
    detail:
      'When you check off a chore, you earn points AND coins at the same time! ' +
      'Points are shown at the top of the screen. There are different kinds: morning ☀️, afternoon 🌤️, and evening 🌙 points — each type matches when you did your chore. ' +
      'Coins 💰 are shown in yellow. You can spend them in the Store to buy outfits, accessories, and habitats for your pet. ' +
      'You can also spend coins to redeem special Reward Presents that your parent sets up!',
    audience: 'kid',
  },
  {
    id: 'kid-streak',
    title: '🔥 Your Streak',
    summary: 'Finish all your chores every day to build a streak!',
    detail:
      'A streak counts how many days in a row you have finished ALL of your chores. ' +
      'When you complete every chore on your list, you get a streak point and a fun celebration! ' +
      'Your current streak is shown on the main screen. Try to beat your best streak! ' +
      'If you miss a day and don\'t finish all your chores, your streak resets to zero. ' +
      'Come back every day to keep it going!',
    audience: 'kid',
  },
  {
    id: 'kid-chores',
    title: '📋 Chores',
    summary: 'Check off your chores to earn points and keep your streak.',
    detail:
      'Tap the Chores button to see your chore list. Chores are sorted by time of day — morning, afternoon, and evening. ' +
      'Tap a chore to check it off. You\'ll earn points and coins right away! ' +
      'Some families have Parent Approval turned on. If yours does, your chore will say "Pending" until a parent approves it — then you\'ll get your points. ' +
      'Your chore list is different on weekdays (Monday–Friday) and weekends (Saturday–Sunday). ' +
      'If your chores look old, tap the Refresh button to get today\'s fresh list.',
    audience: 'kid',
  },
  {
    id: 'kid-store',
    title: '🛍️ The Store',
    summary: 'Spend your coins on outfits, accessories, and habitats.',
    detail:
      'Tap the Store button to go shopping! You can buy three kinds of things: ' +
      'Outfits 👕 dress up your pet. Accessories add a fun item to your pet\'s look. Habitats 🏡 change the background behind your pet. ' +
      'When you buy something, it gets equipped right away. You can swap between things you already own for free! ' +
      'You can also find Reward Presents 🎁 in the Store — these are special prizes your parent created just for you. Redeem them with coins, then ask your parent to give you the real reward!',
    audience: 'kid',
  },
  {
    id: 'kid-minigames',
    title: '🎮 Mini-Games',
    summary: 'Tap your pet to play games and win coins!',
    detail:
      'Want to play? Tap on your pet to open the full-screen pet view! After a greeting, you\'ll get to play a mini-game. ' +
      'There are three games you might see — it\'s random each time! ' +
      '🎡 Spin the Wheel: Spin a colorful wheel and win whatever it lands on — could be coins, points, or other surprises. ' +
      '⬜ Tic Tac Toe: Play tic tac toe against your pet. Win to earn coins! ' +
      '🧠 Trivia: Answer a fun question. Get it right and you\'ll earn a coin reward. ' +
      'Mini-games are a great way to earn extra coins!',
    audience: 'kid',
  },
  {
    id: 'kid-change-creature',
    title: '🐢 Change Creature',
    summary: 'Pick a new pet and give it a new name.',
    detail:
      'Tap the Change button in the toolbar to pick a new creature! ' +
      'You can choose from different animals and give your pet any name you like. ' +
      'Once you confirm your choice, your new pet will appear on the main screen. ' +
      'Don\'t worry — your points, coins, outfits, and chores all stay the same when you change creatures.',
    audience: 'kid',
  },
  {
    id: 'kid-switch-profile',
    title: '👥 Switch Profile',
    summary: 'Switch to a different kid\'s profile.',
    detail:
      'If your family has more than one child in HabitHatch, you can tap the Switch button to go back to the profile picker and choose a different player. ' +
      'Each kid has their own pet, chores, points, and coins — switching profiles won\'t change anyone else\'s progress.',
    audience: 'kid',
  },
];

export const PARENT_HELP_TOPICS: HelpTopic[] = [
  {
    id: 'parent-pin',
    title: '🔒 PIN Setup & Access',
    summary: 'Create a PIN to access Parent Mode.',
    detail:
      'To access Parent Mode, tap the Parent button in the kid\'s toolbar. ' +
      'The first time you tap it, you\'ll be asked to create a 4-digit PIN. Choose something you\'ll remember but your child won\'t easily guess. ' +
      'After your PIN is set, you\'ll need to enter it each time you open Parent Mode. ' +
      'Your PIN is stored on this device. If you share the app across multiple devices, each device is set up separately using the Join Code feature.',
    audience: 'parent',
  },
  {
    id: 'parent-chores',
    title: '📋 Managing Chores',
    summary: 'Add or remove chores for any child, any day.',
    detail:
      'In Parent Mode, tap a child\'s profile to see their chore list. You can add new chores by typing in the Add Chore field and tapping the add button. ' +
      'Remove a chore by tapping the delete icon next to it. ' +
      'Chores are separated by time of day (morning, afternoon, evening) and by day type — weekday chores apply Monday through Friday, and weekend chores apply Saturday and Sunday. ' +
      'Use the day toggle to switch between weekday and weekend chore lists. ' +
      'You can also add the same chore to ALL children at once using the "Add to All Kids" option.',
    audience: 'parent',
  },
  {
    id: 'parent-approve',
    title: '✅ Approving Chores',
    summary: 'Review and approve or reject pending chore check-offs.',
    detail:
      'When Parent Approval is active, a child\'s chore will show as "Pending" after they check it off — they don\'t receive points yet. ' +
      'In Parent Mode, pending chores appear at the top of the panel under "Pending Approvals". ' +
      'Tap Approve ✅ to award the points and coins to the child. Tap Reject ❌ to send the chore back to unchecked so the child can try again. ' +
      'Parent Approval is enabled automatically when a PIN is set. If you prefer instant point rewards without review, you can remove the PIN.',
    audience: 'parent',
  },
  {
    id: 'parent-bonus',
    title: '⭐ Bonus Points',
    summary: 'Award extra points and coins for great behaviour.',
    detail:
      'In Parent Mode, find the child you want to reward and look for the Bonus section. ' +
      'Choose a chore category (morning, afternoon, or evening), enter the number of points to award, and optionally add a reason (e.g., "Great job helping with dinner!"). ' +
      'Tapping Give Bonus adds the points and an equal number of coins to the child\'s totals right away. ' +
      'The child will receive a notification if push notifications are enabled.',
    audience: 'parent',
  },
  {
    id: 'parent-rewards',
    title: '🎁 Reward Presents',
    summary: 'Create real-world rewards kids can buy with coins.',
    detail:
      'Reward Presents let you create custom prizes your children can save up for. Examples: "Extra screen time", "Pizza night pick", "Toy store trip". ' +
      'To add a reward: in Parent Mode, go to the Rewards section, type the reward name, set a coin price, and tap Add. ' +
      'The reward will appear in the Store for all children to see. When a child redeems a reward, it appears in the "Fulfilled Rewards" list in Parent Mode. ' +
      'Tap Mark Fulfilled once you\'ve given the child the real-world prize. The child will receive a notification.',
    audience: 'parent',
  },
  {
    id: 'parent-pause',
    title: '💤 Pause Mode',
    summary: 'Pause a child\'s profile during holidays or breaks.',
    detail:
      'Pause Mode lets you temporarily freeze a child\'s pet so it doesn\'t get hungry or lose health while the family is on holiday or taking a break. ' +
      'To pause: in Parent Mode, find the child and toggle the Pause switch. A "Resting" banner appears on their pet screen. ' +
      'While paused: health decay stops, daily chore resets are skipped, and streak progress is frozen. ' +
      'The date counter still advances (so chore history is accurate), but no progress is lost. ' +
      'When you toggle Pause off, the daily reset runs immediately and the pet resumes normal decay.',
    audience: 'parent',
  },
  {
    id: 'parent-profiles',
    title: '👦 Child Profiles',
    summary: 'Manage names and multiple profiles.',
    detail:
      'Each child in your family has their own profile with their own pet, chores, coins, and progress. ' +
      'To update a child\'s display name: in Parent Mode, find their profile and tap the edit icon next to their name. Enter the new name and confirm. ' +
      'To add a new child: tap the "+ Add Child" button at the bottom of Parent Mode. You\'ll be taken through a setup flow to create a new profile. ' +
      'Each profile is stored separately — changes to one child\'s profile do not affect others.',
    audience: 'parent',
  },
  {
    id: 'parent-join-code',
    title: '📲 Join Code',
    summary: 'Add your family to another device.',
    detail:
      'The Join Code lets you access the same family on a second device (e.g., a tablet and a phone). ' +
      'To find your code: in Parent Mode, look for the Join Code section — it shows a short alphanumeric code. ' +
      'On the second device: open HabitHatch, choose "Join a Family" on the setup screen, and enter the code. The device will sync all child profiles from the cloud. ' +
      'Join Codes require a cloud/Firebase connection. The code is specific to your family and does not change.',
    audience: 'parent',
  },
  {
    id: 'parent-chore-points',
    title: '🏆 Chore Points',
    summary: 'Set how many points each chore category is worth.',
    detail:
      'By default, every chore is worth a set number of points. You can customise this per child. ' +
      'In Parent Mode, find the child\'s profile and look for the Chore Points section. ' +
      'You\'ll see three categories: morning ☀️, afternoon 🌤️, and evening 🌙. ' +
      'Adjust the points slider or input for each category. Changes take effect immediately — the next chore the child checks off in that category will award the new point value. ' +
      'Coins earned always match the point value.',
    audience: 'parent',
  },
];
