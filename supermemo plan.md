
ABC
Guide
Hints&Tips
Overviews
FAQs
Glossary
Support
Search
 
Plan
Editable (wiki) version of this page
Contents
1 Creating a new schedule
2 Executing the schedule
3 Alarm
4 Schedule analysis
5 Schedule exceptions and emergencies
6 Activity statistics
7 Activity parameters
8 Other options : Toolbar
9 Other options : Menu
10 FAQ
10.1 Use incremental reading instead of Plan to optimize time allocations to different learning subjects
10.2 Tasklists vs. Plan
10.3 Gray fields cannot be edited
10.4 All activities included in the schedule are added to the statistics
10.5 SuperMemo Plan is not of much use beyond SuperMemo
10.6 Slots do not fit Tools : Plan
10.7 Undo in activity editor

If you think "I wish there were 20 of me" or "There aren't enough hours in the day", SuperMemo can help you with Tools : Plan.

Tools : Plan can help you do two things:

first you say what you would like to do, and then
you let SuperMemo compute what can realistically be done within a day.
When using Plan you produce a list of activities and the desired time allocations for these activities. SuperMemo then checks the available time, and shortens all activities in proportion. If your days are repetitive, you can fine-tune your schedule to the last minute. If they are not, you can still benefit by planning in advance and tracking your progress as you go.

Plan can be used to plan your entire day, or it can be used to plan shorter slots, e.g. your daily learning slot. For example, your 2-hour-long learning schedule in the evening could look like this:

30 min - surfing the net (searching for interesting articles)
30 min - reviewing articles, quick reading, importing the most valuable articles to SuperMemo
30 min - reading in SuperMemo, introducing new articles to the learning process, topic repetitions, extracting new topics, generating cloze deletions
30 min - core item repetitions in SuperMemo
Using Plan to plan the entire day works best for people who are not limited by meetings, deadlines, and multiple interruptions. It is most suited for those who can freely schedule activities throughout the day. But, with some skill and effort, it can also be used by those whose days change at a minute's notice, and those whose days are not composed of regularly repeating activities.

Future society will strongly drift towards deadline-free, creative work that will excellently fit dynamic scheduling offered by Plan.

The main purpose of Plan is to keep optimum proportions of time devoted to particular activities in your schedule (e.g. 25 minutes for e-mail, 25 minutes for web surfing, 105 minutes for learning, 45 minutes for sports, 2.3 hours for the kids, etc.).

An optimally adjusted schedule is a powerful tool that can help you understand nuances of time-management. You can make one-minute daily adjustments to the schedule in order to maximize the effectiveness of your work, your health, your family life, and minimize stress and chaos introduced by poor planning. It will give you a quality insight into your own life. It will help you see the connection between your activities and their results. It will ensure that you stop neglecting lesser things that can produce major problems in a long run. Plan is highly recommended for people with low-stress tolerance and perpetual problem with organizing their day.

With Tools : Plan you first create a schedule and then execute it.

Creating a new schedule
Choose Tools : Plan or press Ctrl+P
Click on the hours field at the top and type in the length of your schedule in hours (e.g. type 18.3 if you want your waking day to last 18.3 hours)
Click on the Activity field in the first row (the one which starts at 0:00) and type in your first activity of the day, e.g. Washing and breakfast
Press Enter to move to the Length column
Type the length of time in minutes you would like to spend on your first activity (e.g. 40 minutes for Washing and breakfast)
Press Enter to move to the second row (second activity). Ignore all other fields. At this point they are mostly meaningless!
Type in the second activity and the time you would like to devote to it (e.g. Learning with SuperMemo, 100 minutes)
Press Enter again to create the third activity, type its name and time
Keep on typing in your activities until your schedule is complete. Do not look at the sum of times of the activities. Always use the length of time you would want to spend on an activity; even if it is not very realistic
See the picture below for an exemplary whole-day schedule
Type in the start time of your schedule template (Start field in the first row) or leave it as 0:00 if you often change the start time. The schedule in the picture begins at 5:00 (which means 5 am)
If some activities must start at a specific hour, click the Start field of these activities and type in the start time (fixed time will be marked as an F on the left). The exemplary schedule below, has two activities that begin at fixed time (Work at 8:00, and Lunch at 15:00); the rest is composed of floating activities whose timing is optimized by SuperMemo
You can now inspect other fields of your schedule. ActLen will tell you how much SuperMemo can actually allocate for a given activity. This will often be less than Length. After all, we nearly always have greater plans than we can squeeze into 24 hours. In the picture below, Work: Creativity begins at 8:22. The desired length of this activity is 360 minutes, but there isn't enough time before Meal: Lunch. SuperMemo must then reduce the time for this slot down to 265 minutes. If fixed activities squeeze other activities too much, you can reshuffle activities by dragging them (grab the activity with the mouse by the gray field on the left)
OptLen indicates how much SuperMemo could allocate for an activity if there were no fixed-time activities. For example, SuperMemo could allocate 340 minutes for Work: Creativity if it was not squeezed into the work slot between 8 am and 15:00. This column helps you assess the damage inflicted by fixed slot timing and fixed slot duration.
OptStart indicates the optimum start hour for an activity if there were no fixed-time activities (OptStart[n-1]+OptLen[n-1]=OptStart[n]). If Work could start at 7:07 and the Work: Creativity slot at 7:36, you would be able to use the optimum 340 minutes for Work: Creativity. This column tells you how much the timing of slots departs from the optimum schedule as a result of fixed timing or duration.
OptShift equals OptStart minus Start. This column tells you how much the relative timing of slots changes as a result of fixed timing or duration.
Delay indicates the delay in minutes of the actual activity start (the Start column) as compared with the optimum start (OptStart). In other words, Delay=Start-OptStart [min]. For example, Work begins 53 minutes after the optimum time. On the other hand, Lunch comes 66 minutes too early as compared with the optimum. The advancement of other slots (i.e. the negative delay) is proportionally reduced down to zero as the schedule progresses towards the last activity of the day: Shower
The Percent column tells you what proportion of time has been used for a given activity as compared with the optimum time. In a schedule without fixed activities, this column always shows 100% for all activities. Due to the fixed-time for Work (squeezed between 8 am and 15:00), all Work activities are reduced to 78% of their optimum value. At the same time, evening activities have some more slack and get 119% (i.e. 19% more time as compared with the optimum schedule without fixed-time activities)
SuperMemo: An exemplary Tools : Plan schedule
Executing the schedule
Your schedule template defines your optimum at which you should strive. However, in real life you will never reach this optimum. This is why you will always need to start a day with your schedule template and modify the schedule in real-time as you go. The process of executing the schedule may also use the sound alarm that will help you terminate activities when their time is up.

At the beginning of your working day, open Tools : Plan (Ctrl+P)
Choose the schedule template in the combo box in the top-left corner (on the first day, you will probably only have one schedule listed there: your original schedule template created above).
Choose Menu : Save as (the Menu button is the first button on the toolbar) or press Ctrl+Shift+S
SuperMemo, by default, will name your today's schedule by using today's date (e.g. "Nov 08, 2006, Wed.txt"). Note the txt extension indicating that each schedule is a simple text file that can be inspected with Notepad
If the present time differs from Start time for the first activity, click on the first activity and click the button Begin (the one with the clock icon) or press Alt+B. Begin inserts the current time in the Start field of the selected activity. If you keep Menu : Alarm : Auto-alarm checked, Begin will also start the alarm timer. The alarm will sound shortly before the end of the current activity. You can determine the sound file to play at alarm time by using Menu : Alarm : Choose music. When the alarm comes up (see the picture below), you will be able to prolong the activity by a few minutes if necessary. The ActLen field of the first activity tells you the actual allocated length of the activity in minutes
Once the alarm sounds or you complete your first activity, click on the row corresponding with the next activity and click Begin again. This will update the start time of the newly started activity. The whole schedule is automatically rebuilt and optimized. You will see changes to the actual length (ActLen), delay (Delay) and other columns in the schedule. The new alarm will be set to ring shortly before the end of the current activity according to the new optimum
Upon the next alarm, click Begin on the next activity and execute it as well. Repeat these steps until you reach the end of your schedule or until it is forcefully terminated (e.g. by other obligations or by the time you should go to sleep)
At the end of the schedule, select the last executed activity and choose Menu : Terminate. Your schedule is complete. At Terminate, answer Yes to "Use current time to terminate?". "No" is reserved for cases when you fail to Terminate at the end of the schedule due to an emergency, and you still will want to keep accurate data for the sake of statistics or diary records. You can also routinely use Terminate at the beginning of the next day if you turn off your computer some time before sleep (e.g. before Shower)
On the next day, optionally, process the schedule, e.g. use Terminate (if not terminated on the previous day), execute schedule analysis, compute schedule statistics, export the schedule to your diary, etc. In the end, choose Menu : Tools : Archive (Shift+Ctrl+A) to save the schedule in the archive
Go back to Step 1
This is how the schedule could have looked after having been executed (as exported with Export on the toolbar):

Nov 08, 2006, Wed (17.6 h)

05:11 - Jogging (29:13)(44 min; 150% of 29 min)
05:55 - Shower(25 min; 170% of 15 min)
06:20 - Meal: Breakfast and news (Democrats take over the House of Representatives)(70 min; 239% of 29 min)
07:30 - SuperMemo (new articles about sustainable development)(30 min; 51% of 59 min)
08:00 - Work: Planning(15 min; 51% of 29 min)
08:15 - Work: Creativity (The Stilo Project)(225 min; 64% of 352 min)
12:00 - Work: Business, meetings and tasklist(191 min; 109% of 176 min)
15:11 - Meal: Lunch(49 min; 125% of 39 min)
16:00 - Rest and newspapers(52 min; 178% of 29 min)
16:52 - Kids(109 min; 93% of 117 min)
18:41 - House: tasklist (fixing the sink)(19 min; 39% of 49 min)
19:00 - Meal: Supper(45 min; 154% of 29 min)
19:45 - SuperMemo(85 min; 145% of 59 min)
21:10 - E-mail (high-school reunion notification)(42 min; 215% of 20 min)
21:52 - Shower(54 min; 221% of 24 min)
22:46 - Sleep
The above file is directly importable to your diary providing a daily record of your performance. Note than none of the activities lasted as long as planned (100%). The figures in the parentheses indicate the actual length (ActLen field), the percentage of time devoted to the activity as compared with the optimum time (OptLen field). Note also that the total time was increased to 17.6 hours on this particular day due to going to sleep 46 minutes later than planned (22:46 instead of 22:00).

Alarm
Shortly before the end of the current activity, the alarm is raised (as in the picture below). You can either stop the alarm or snooze it by typing in the number of minutes to pass until the alarm is to be raised again.

SuperMemo: Incremental e-mail processing interrupted by Alarm when the time allocated for the activity has been come to an end
If you turn off the computer or just exit SuperMemo, the alarm will not be raised. If you want to quit SuperMemo and still keep the alarm going, send SuperMemo to the notification area (formerly known as the system tray or the status area) with Window : Hide SuperMemo (Shift+Ctrl+G). You can see the time remaining to the next alarm by moving the mouse over the SuperMemo icon in the notification area. To bring SuperMemo back out of the notification area (colloquially known as the system tray), click its icon on your Windows desktop or in the area. You can also bring SuperMemo back with its Windows shortcut (if you have created one).

While the alarm dialog is up, it plays your selected sound file (use Menu : Alarm : Choose music to change the file).

Schedule analysis
If you keep overrunning your allocated time slots, the remaining activities of the day will progressively get squeezed. This is the main problem with using Plan. The problem, naturally, does not come from the system of optimizing your day with Plan. The problem comes from our natural tendency to add time to enjoyable slots, from being late, as well as from being interrupted by unexpected events (e.g. phone calls). If you do not religiously stick to the schedule, schedule optimization will not work! A vast majority of users of Plan report doing well only in the first half of the day, while activities scheduled for the evening usually get squeezed beyond usability. This is where schedule analysis with Delays comes handy. It helps you better understand your weaknesses, as well as weak spots in the schedule (i.e. activities for which you allocate too little time, activities which you tend to overrun, etc.).

Not only at the beginning, your schedule will require fine-tuning (i.e. adding a few minutes here, taking away a few minutes there, etc.). You may always want to reduce the time for breakfast and increase the time for sports or education; however, your plans may be unrealistic. In the exemplary schedule above, you may find yourself spending an average of 48 minutes for breakfast as opposed to the desired 30 minutes. To prevent this from happening, you should use the button Delays to honestly analyze your schedule and realistically adjust the length of activities that you never manage to complete in time or which never get enough time as compared with the plan. Use your currently executed schedule to analyze today's (or yesterday's) delays, and use your schedule template to correct weak spots.

The delay analysis of the schedule presented in the previous paragraph would produce the following outcome:

Delays: Nov 08, 2006, Wed (17.6 h)

40 min.: Meal: Breakfast and news (30->70 min.)
29 min.: Shower (25->54 min.)
25 min.: SuperMemo (60->85 min.)
22 min.: Rest and newspapers (30->52 min.)
22 min.: E-mail (20->42 min.)
15 min.: Meal: Supper (30->45 min.)
14 min.: Jogging (30->44 min.)
11 min.: Work: Business, meetings and tasklist (180->191 min.)
10 min.: Shower (15->25 min.)
9 min.: Meal: Lunch (40->49 min.)
-11 min.: Kids (120->109 min.)
-15 min.: Work: Planning (30->15 min.)
-30 min.: SuperMemo (60->30 min.)
-31 min.: House: tasklist (50->19 min.)
-135 min.: Work: Creativity (360->225 min.)
Delayed: 03:17 hours
Extras: 00:00 hours
Lost: 03:42 hours

(exported: Thursday, November 09, 2006, 1:41:23 PM)
In the schedule above, there were delays of 3 hours and 17 min. There were no extra slots inserted. The losses in shortened activities stood at 3 hours and 42 min. Those numbers are relative to your originally desired values. Once you use Adjust, delays and losses should be of the same value; in this case: 3 hours and 28 min (not listed above).

It is easy to notice that Breakfast and news was the greatest schedule offender. You have devoted 70 minutes instead of the planned 30 minutes. This produced a 40 min. delay in the schedule. Your evening shower lasted 54 minutes instead of the usual 25 adding 29 minutes to the total delay. In conclusion you may decide to either improve your discipline (e.g. by taking shorter showers) or increase the desired length of time devoted to individual slots (e.g. increase the breakfast slot to avoid the bad practice of eating in a hurry). It is enough you go through the slots that produce delays. Extending these slots will automatically shorten all other slots.

As for the slots that produced negative delay, you may want to check for consequences of doing less than planned. Those may be strategic slots that you like less or execute too late (e.g. while being tired, or when the other activities in the schedule squeeze the slot in question out of the allocated time).

Once your schedule seems perfect, you should by all means avoid delays which call the whole idea of schedule optimization in question. You have to realistically adjust the lengths of activities and strive at completing individual slots ahead of time. This will prevent end-of-schedule activities from being a constant casualty of delays.

Once your schedule stabilizes and you can efficiently stick to its timing, you can use the button Adjust on the toolbar that will copy ActLen fields to Length fields. This will help you adjust realistic length figures upon schedule analysis. Usually, your first plans will by far exceed your abilities, hence the importance of the Adjust option. Note that in earlier SuperMemos, OptLen field was used in ActLen. This would not account for fixed-time slots that may require compressing preceding or succeeding activities. Now, even if you use fixed times (e.g. to perfectly time your nap, or to squeeze in an appointment), after Adjust, the % column should all be set to 100%.

Remember to use it only on your template schedule, or at the beginning of the day, otherwise you won't be able to do delay analysis (Plan will now think you are doing your timing optimally).

Schedule exceptions and emergencies
The following circumstances may call for special actions in the schedule manager:

Moving an activity - if you need to change the sequence of floating activities, you can drag one ahead of another (e.g. you may drag e-mail ahead of SuperMemo if you expect your colleague to send you an important article to read incrementally). To drag an activity, press the left mouse button down on the gray column on the left and drag the activity up or down
Adding an activity - during the execution of your schedule, you might figure out that you need to insert an additional activity (e.g. an unexpected family visit). For that purpose, select the activity before which the new slot is to be inserted, and press Ins (or choose Menu : Insert). Type in the length of the new slot or type in the expected start time and end time. All activities before and after the inserted activity will optimally be stretched or compressed (with the assumption that no activity will be split). If compression is disproportionate on one side of the inserted activity, move some floating activities away from the overcrowded part
Splitting an activity - if you want to insert a short break into an activity (e.g. breaking news on TV in your learning slot) you can choose Menu : Split (Ctrl+T). This will help you execute an activity in two portions. SuperMemo will use the time that elapsed from the beginning of the slot as the split default. For example, if your learning slot is 120 minutes but you are sleepy and would like to take a refreshing nap before you continue until the end of the slot you will want to split it and proceed with a nap slot ahead of the remaining part of the slot.
Merging activities - if you want to conglomerate activities, move one of them to make sure it precedes the other. Choose the first activity and select Menu : Merge. For example, if you want to exceptionally take the kids to the cinema in your Kids slot, you may figure out that the slot is too short. You could then give up your House: tasklist and merge it with the kids slot. If this is still not enough, you could merge in E-mail. When you merge two or more slots, you should remember to avoid consuming strategic slots by less important activities. Otherwise, you will defeat the main purpose of Plan: self-discipline in sticking to optimum proportions of activities. If you decide to merge your learning slot with house tasklist in order to make orders in the shed, you will lose your learning slot. Not only will your education suffer. You will also not be able to effectively run the schedule analysis for that day
Fix the starting hour of an activity - if you plan to take kids to the cinema at 18:00, you can click the Kids slot and type in the fixed hour in the Start column. All your activities before that slot will be extended proportionally. Follow-up activities will be shortened. You can reduce the resulting imbalance by moving some activities from more crowded to lesser crowded portions of the schedule
Removing an activity - if you want to skip an activity due to delays or due to its lower priority, you can delete it with Del. Alternatively, in Delays, you can focus only on adding time to activities that take more than you plan. In such cases, deleted slots will gradually be squeezed in length in the original schedule by expanding the slots that gain time upon the delete
Rigid activities - if you happen to adjust the time of a single slot again and again, and you know precisely how much time you want allocated to that slot, you can save time by clicking the R column and making that slot rigid. Rigid slot will always take as much as you plan for it. For example, if you always overrun Rest and newspapers due to the lazy human nature, and you never want to allocate a minute beyond the originally planned 30 minutes, set this slot as rigid 30 minutes and never worry about adjusting it again
Activity statistics
If you would like to keep statistics of individual activities, group activities by starting their name with the same keyword. For example, name your SuperMemo repetition slots as Reps A, Reps B and Reps C. If you select Totals on the toolbar, SuperMemo will add up the time used for repetitions by adding the length of the three slots starting with the keyword Reps. If you want to modify the length of the activity in the statistics, e.g. due to a short break, list the corrected length immediately after the keyword. For example, if Reps B lasted 23 minutes, but you had to leave for the toilet, you could correct it to read as Reps 18 B. SuperMemo will then add 18 minutes of Reps to statistics instead of 23 minutes.

If you want to keep additional statistics, you can list them inside individual slots by preceding the keyword with ++ and following it with a statistic. For example, if you want to keep statistics of individual sport efforts in your 2-hour sports slot, you could write down the sports slot as:
Sports 120: ++Jogging 20 (two rounds), ++Gym 15 (low-back strengthening), ++Swimming 25, ++Sauna 20, walking back home

For the schedule above, the daily totals will look as follows:

TOTALS: Nov 08, 2006, Wed (17.6 h)

Work 431 min. (07:11)
15 Work: Planning
225 Work: Creativity
191 Work: Business, meetings and tasklist
Meal 164 min. (02:44)
70 Meal: Breakfast and news
49 Meal: Lunch
45 Meal: Supper
SuperMemo 115 min. (01:55)
30 SuperMemo
85 SuperMemo
Kids 109 min. (01:49)
109 Kids
Shower 79 min. (01:19)
25 Shower
54 Shower
Rest 52 min. (00:52)
52 Rest and newspapers
Jogging 44 min. (00:44)
44 Jogging
E-mail 42 min. (00:42)
42 E-mail
House 19 min. (00:19)
19 House: tasklist
If you keep Monthly statistics update checked when using Totals, SuperMemo will store daily statistics in your monthly statistics file. If you check Annual statistics update, SuperMemo will collect all monthly statistics (from monthly statistics files), generate an annual statistics file, and display it in your default spreadsheet (e.g. in Excel).
For the above example, the following files will be used to store statistics:

monthly statistics for November 2008: <SuperMemo folder>\plans\stats\2008\2008 Nov.csv
annual statistics for 2008: <SuperMemo folder>\plans\stats\2008\2008 Year Totals.csv
Activity parameters
If your schedule is overcrowded with multiple slots, you can group some of them together, and make SuperMemo randomly choose one on a given day, another on another day, etc. For that purpose choose Menu : Activities or press Shift+Ctrl+E. List the activities in individual rows of the Activity Options dialog box. Specify the length of individual activities and the maximum length of the slot in Length (min). On saving the new schedule with Save as, SuperMemo will randomly select one of the listed activities and choose its proposed length in schedule optimization (on condition the length is not longer than the maximum length allowed for that slot). For example, if you would like to alternatively browse New Scientist, cnn.com and Scientific American websites, and your time is too short to go to all these places in your reading slot, you can ask SuperMemo to randomly assign a single site on a given day, so that you could explore them individually. SuperMemo may then list the following entry in the schedule:

{#R: 16 Read NS | 10 Read cnn.com | 13 Read SciAm}
In this case, Plan will try to allocate randomly 16 minutes for NS, 10 min. for cnn.com or 13 min. for SciAm. As always, the actual length of these activities will depend on the allocation of time for other things on this particular day.
Instead of using random allocations, you can also choose to assign a different slot to each day of the week (use Choice method: By day in Activity Options). For example:

{#D: 10 Read: cnn.com | 16 Read: NS | 13 Read: SciAm | 16 Read: NS | 15 Read: Wikipedia | 16 Read: Economist | 16 Read: PCMag.com}
In this case, Plan will try to allocate 10 min for cnn.com on Monday, 16 min. for New Scientist on Tuesday, etc.

Other options : Toolbar
Menu - Plan menu (see below)
Save (Ctrl+S) - save the currently edited schedule on the disk
Begin (Alt+B) - begin executing the selected activity. This sets the Start time of the activity to the current time and activates the alarm timer if Menu : Alarm : Auto-alarm is checked
Export - export the schedule as HTML (e.g. to use it as a diary entry skeleton)
Delays - see which activities introduce delays in the schedule
Edit (Alt+Enter, Ctrl+E or double click) - edit the activity (e.g. when it requires a longer description). Editing in-place can be activated with Enter
Totals - add up activity statistics. Daily statistics are displayed as an HTML file. Monthly and annual statistics are kept in comma-separated file format (e.g. for use with spreadsheets)
Adjust - convert the "desired schedule" into the "optimum schedule" to use more realistic timing when fine-tuning the schedule (copy OptLen fields to Length fields)
Split (Ctrl+T) - split the activity in two
Fix (Ctrl+F) - fix the selected activity at its current start time (SuperMemo will not change the start time)
Other options : Menu
SuperMemo: Tools : Plan: Local menu
Open (Ctrl+O) - open another schedule
New (Ctrl+N) - start creating a new schedule template
Save (Ctrl+S) - same as the Save button (above)
Save as (Shift+Ctrl+S) - save the currently selected schedule template on a given day before executing the schedule
Edit (Ctrl+E) - same as the Edit button (above)
Activities (Shift+Ctrl+E) - define activities that should be used in Plan on different days
Begin (Alt+B) - same as the Begin button (above)
Insert (Ins) - insert an activity
Delete (Ctrl+Del) - delete an activity
Split (Ctrl+T) - same as the Split button (above)
Merge - merge the currently selected activity with the one that follows
Fix (Ctrl+F) - same as the Fix button (above)
Terminate (Shift+Ctrl+Enter) - terminate the schedule on the selected activity (either at current time, e.g. if you are going to sleep, or at the activity's start time, e.g. if you are marking the termination hour for statistics on the next day)
Alarm
Auto-alarm - turn on/off the automatic activation of the alarm timer when using Begin
Begin - same as the Begin button (above)
Remind - set the alarm to be raised at the end of the currently scheduled activity
Set alarm - set the alarm to be raised at a desired time
Stop - stop the alarm timer
Choose music - select a sound file that will be played at alarm time
Tools
Export - same as the Export button (above)
Totals - same as the Totals button (above)
Delays - same as the Delays button (above)
Archive (Shift+Ctrl+A) - move the schedule to the archive
Adjust - same as the Adjust button (above)
Adjust from now - set optimal activity length as of the present moment
Adjust from selected - set optimal activity length as of the selected activity
Reset - reset the schedule, i.e. set all Length fields to the optimum possible length, unfix start times and adjust start times to the optimum listed in the OptStart column
Paste from diary - paste from the clipboard an HTML diary text (as exported earlier with Export)
Close (Esc) - close the Schedule plan window
FAQ
Use incremental reading instead of Plan to optimize time allocations to different learning subjects
Tasklists vs. Plan
Gray fields cannot be edited
SuperMemo Plan is not of much use beyond SuperMemo

Use incremental reading instead of Plan to optimize time allocations to different learning subjects
From: Luis Neves
Country: Brazil
Sent: Dec 4, 2000
Question

I would like to spend five hours on effective reading and learning starting at 6 pm. However, my interests are wide. Here are some things I would like to read: 3 daily newspapers, 1 daily Dilbert comic strip, 1 daily Linux news journal, 1 daily Internet news journal, 2 weekly magazines, 2 monthly science magazines, 1 on-line book of C language, 1 on-line book of TCL/TK language, 1 site for Kylix and Delphi, 1 neuroscience site and more. What would be my optimum strategy assuming I want to use SuperMemo and incremental reading?

Answer

You could best prioritize your entire learning with incremental reading. Proportions of individual subjects could best be determined by the priority queue. However, Tools : Plan can also be helpful, esp. if you need to add some reading on paper. This could be your exemplary schedule:

Reading&Learning (5 h)
18:00 - SuperMemo - incremental reading and importing new articles(81 min, 100%)
19:21 . SuperMemo - incremental reading of high-priority material(40 min, 100%)
20:01 . SuperMemo - core repetitions(40 min, 100%)
20:41 . Linux, C, TCL/TK - 2 articles(17 min, 100%)
20:59 . Internet - 1 article(13 min, 100%)
21:12 . Kylix/Delphi - 2 articles(20 min, 100%)
21:33 . Neuroscience - 1 article(20 min, 100%)
21:53 . reading on paper (weekly, science)(61 min, 100%)
22:53 . other (Dilbert)(7 min, 100%)
The plan above was built using the following assumptions:

due to possible delays, you should put strategic slots first. If SuperMemo eats up too much time, you will just reduce the rate of importing new articles
you would import only 1-2 articles per slot (as specified in the plan). These articles would immediately be introduced into the process of incremental reading
Linux, Internet, Kylix and Neuroscience slots are supposed to be spent only on locating articles and importing them to SuperMemo. The actual reading will take place in the first slot of the day
all reading on paper was put into a single late slot. As reading on paper is by far less efficient, you will then give it lower priority and you will have to retype important notes to SuperMemo if you want to ensure long-term retention
SuperMemo slots will be used for reading articles, extracting their portions, reviewing extracts, creating cloze deletions, standard repetitions, etc.
SuperMemo core will include only repetitions of your top-priority items
Tasklists vs. Plan
From: Jarek Dobrowolski
Country: Poland
Sent: Fri, Aug 25, 2000 16:43
Question

Tasklists are an interesting concept but they are too trivial a model of reality to be universal. For example, how can I best split 9 hours into the optimum amount for sleep and jogging? Should it be 8+1 or 8.5+0.5? Tasklists do not help!

Answer

Tasklists work well for a subset of optimization problems you will meet in your daily schedule. Your example is indeed entirely unsuitable to be handled with tasklists. Tasklists demand tasks to be well-defined, uniform and with good estimates on value and time. For example, they work great for prioritizing investments. SuperMemo has always been developed with the use of tasklists. However, you cannot prioritize your house chores and your shopping list using the same tasklist. This fails the uniformity criterion. You need two tasklists for that. Tasklist do not work well with deadlines (even if deadlines are included in the concept). Tasklist are not good at reflecting dependencies between the tasks. In other words they are far from universal. For the problem of optimizing your day, you should rather use Tools : Plan. There you could include 30 minutes of jogging, 8 hours of sleep, 2 hours of incremental reading and 30 minutes of core repetitions. Using delay analysis, you can easily make minor adjustments to your schedule on a daily basis. If jogging made you too tired, you could shorten the distance and the time slot. If you did not get sweaty enough, you could add 3-5 minutes and see the results on the following day. You could add some sleep time if you do not wake up within the slot. You could also add some time for core repetitions if your incremental reading floods the learning process with topics and results in low retention. Tasklist fit well with the Plan within a single uniform time slot. In that slot, you can prioritize your reading, writing, making orders in your house, etc. To sum it up: the model proposed by SuperMemo will regulate the length of the time slot with the Plan. Within your uniform time slot you can use tasklists to prioritize individual activities

Gray fields cannot be edited
Question

Why can I not edit the Delay field?

Answer

Delay is computed automatically by SuperMemo and depends on the start time of a given activity as compared with the optimum time. Once you set the start time of an activity, its delay (in minutes) is fixed and cannot be changed. Only Start, Activity and Length columns are editable. The remaining columns are determined by SuperMemo. The value of those fields come from their mathematical definition and cannot be modified (as much as you cannot modify the number of minutes in an hour)

All activities included in the schedule are added to the statistics
From: M.M.
Sent: Nov 19, 2009, 01:31:26
Question

I am using Plan to compile my learning time statistics. Why are unmarked/unchecked activities such as Reading included/counted in my 2009 Year Total?

Answer

All activities listed in the schedule are taken into consideration. SuperMemo has no way of knowing if you used Begin to mark the beginning of each activity and set up the alarm, or simply stuck to the plan religiously and completed it without using Begin. To simplify things, SuperMemo adds all activities from the schedule at the moment when you choose to save the statistics. All activities havetheir duration taken from the ActLen (actual length) column. The only exception are activities with a manual expression of the duration (e.g. ++Reading 22). If you do not want an activity included in the statistic, simply delete it.

SuperMemo Plan is not of much use beyond SuperMemo
From: zm
Sent: Tuesday, August 28, 2001 10:14 PM
Question

I would like to see better integration of Tools : Plan with MS Outlook. For example, export plan and import it in MS Outlook

Answer

The main idea behind Tools : Plan is to perfectly adjust proportions of time allocated to individual activities during a day or during a learning time block. Those proportions are continually adjusted as you proceed with the execution, and such a plan is of little use without SuperMemo. If you only need to export a record of your daily activities, you can use the Export button. This will export Plan in the HTML format

Slots do not fit Tools : Plan
From: SuperMemo R&D (Beta)
Country: Poland
Sent: Tue, Apr 09, 2002 19:55
Question

If I included all my slots in Tools : Plan, it would require 18 hours which is impossible to manage

Answer

That is exactly where Tools : Plan is supposed to help. We always want more time than we have. Either for work or for rest. The main idea of the Plan is to collect all activities that you would like to execute, give them as much time as you would like to give, and then ask SuperMemo to fit it all together. Your appetite can still be considered temperate if you need only 18 hours per day (after all this is a quite realistic number). However, if you happen to call for 28 hours, SuperMemo will still help you by compressing all activities proportionally. Then, with a daily execution of your schedule, and with the help of delay analysis, you will be able to hone your routine and find the perfectly adjusted proportions for all activities. In an extreme case, some activities will have to go. Others will get compressed to tiny slots. Tools : Plan will help you take a birdseye view of your day and look for efficiency bottlenecks

Undo in activity editor
From: Beta
Country: CA
Sent: Tue, May 12, 2016
Subject: Undo in Plan
Question

Alt+Backspace does not work in the activity editor (Ctrl+E). What if I delete some text by mistake?

Answer

You can use Ctrl+Z or Undo on the context menu (right click). The undo is one-level only