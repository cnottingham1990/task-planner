const e = React.createElement;

function TaskPlanner() {
    const [tasks, setTasks] = React.useState(Array(40).fill(null).map((_, index) => ({
        id: index + 1,
        description: '',
        taskColor: index < 13 ? 'yellow' : 'green',
        duration: '',
        isMandatory: false,
        isComplete: false,
        isDeferred: false,
        dailyHours: {
            Mon: '', Tue: '', Wed: '', Thurs: '', Fri: '', Sat: '', Sun: ''
        }
    })));

    const [unforeseenTasks, setUnforeseenTasks] = React.useState(Array(20).fill(null).map((_, index) => ({
        id: index + 1,
        description: '',
        hours: ''
    })));

    const [userInfo, setUserInfo] = React.useState({
        name: '',
        email: '',
        managerEmail: ''
    });

    const days = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

    function updateTask(index, field, value) {
        const newTasks = [...tasks];
        if (field === 'dailyHours') {
            newTasks[index].dailyHours = { ...newTasks[index].dailyHours, ...value };
        } else {
            newTasks[index][field] = value;
        }
        setTasks(newTasks);
    }

    function updateUnforeseenTask(index, field, value) {
        const newTasks = [...unforeseenTasks];
        newTasks[index] = { ...newTasks[index], [field]: value };
        setUnforeseenTasks(newTasks);
    }

    function calculateDailyTotal(day) {
        return tasks.reduce((sum, task) => {
            const hours = parseFloat(task.dailyHours[day]) || 0;
            return sum + hours;
        }, 0).toFixed(1);
    }

    function calculateWeeklyTotal() {
        return tasks.reduce((sum, task) => {
            const dailyTotal = Object.values(task.dailyHours).reduce((daySum, hours) => {
                return daySum + (parseFloat(hours) || 0);
            }, 0);
            return sum + dailyTotal;
        }, 0).toFixed(1);
    }

    function calculateUnforeseenTotal() {
        return unforeseenTasks.reduce((sum, task) => {
            return sum + (parseFloat(task.hours) || 0);
        }, 0).toFixed(1);
    }

    function calculateGrandTotal() {
        return (parseFloat(calculateWeeklyTotal()) + parseFloat(calculateUnforeseenTotal())).toFixed(1);
    }

    async function handleSubmit() {
        if (!userInfo.name || !userInfo.email || !userInfo.managerEmail) {
            alert('Please fill in your name, email, and manager\'s email before submitting.');
            return;
        }

        const data = {
            userInfo,
            tasks,
            unforeseenTasks,
            totals: {
                weeklyTotal: calculateWeeklyTotal(),
                unforeseenTotal: calculateUnforeseenTotal(),
                grandTotal: calculateGrandTotal(),
                dailyTotals: days.reduce((acc, day) => ({
                    ...acc,
                    [day]: calculateDailyTotal(day)
                }), {})
            }
        };

        try {
            const response = await fetch('https://hook.us1.make.com/k7w6yw4wqpag507q03huhq1i6oqnbc1i', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Task plan submitted successfully!');
            } else {
                alert('Error submitting task plan. Please try again.');
            }
        } catch (error) {
            alert('Error connecting to the server. Please try again.');
        }
    }

    return e('div', { className: 'container mx-auto px-4 py-8' },
        e('div', { className: 'bg-white rounded-lg shadow-lg p-6' },
            e('div', { className: 'mb-6' },
                e('h1', { className: 'text-2xl font-bold' }, 'Weekly Task Planner'),
                e('p', { className: 'text-gray-600' }, '* Include all work that requires a minimum of .5 hours')
            ),
            
            // Main Tasks Table
            e('table', { className: 'w-full border-collapse mb-6' },
                e('thead', null,
                    e('tr', { className: 'bg-gray-50' },
                        e('th', { className: 'border p-2' }, '#'),
                        e('th', { className: 'border p-2' }, 'Task Description'),
                        e('th', { className: 'border p-2' }, 'Duration'),
                        e('th', { className: 'border p-2' }, 'Mandatory'),
                        e('th', { className: 'border p-2' }, 'Complete'),
                        e('th', { className: 'border p-2' }, 'Defer'),
                        ...days.map(day => 
                            e('th', { key: day, className: 'border p-2' }, day)
                        )
                    )
                ),
                e('tbody', null,
                    tasks.map((task, index) => 
                        e('tr', { 
                            key: task.id,
                            className: `task-row-${task.taskColor}`
                        },
                            e('td', { className: 'border p-2' }, task.id),
                            e('td', { className: 'border p-2' },
                                e('input', {
                                    type: 'text',
                                    className: 'w-full p-1 border rounded',
                                    value: task.description,
                                    onChange: (e) => updateTask(index, 'description', e.target.value)
                                })
                            ),
                            e('td', { className: 'border p-2' },
                                e('input', {
                                    type: 'number',
                                    className: 'p-1 border rounded',
                                    value: task.duration,
                                    onChange: (e) => updateTask(index, 'duration', e.target.value)
                                })
                            ),
                            e('td', { className: 'border p-2 checkbox-cell' },
                                e('input', {
                                    type: 'checkbox',
                                    checked: task.isMandatory,
                                    onChange: (e) => updateTask(index, 'isMandatory', e.target.checked)
                                })
                            ),
                            e('td', { className: 'border p-2 checkbox-cell' },
                                e('input', {
                                    type: 'checkbox',
                                    checked: task.isComplete,
                                    onChange: (e) => updateTask(index, 'isComplete', e.target.checked)
                                })
                            ),
                            e('td', { className: 'border p-2 checkbox-cell' },
                                e('input', {
                                    type: 'checkbox',
                                    checked: task.isDeferred,
                                    onChange: (e) => updateTask(index, 'isDeferred', e.target.checked)
                                })
                            ),
                            ...days.map(day => 
                                e('td', { key: day, className: 'border p-2' },
                                    e('input', {
                                        type: 'number',
                                        className: 'p-1 border rounded',
                                        value: task.dailyHours[day],
                                        onChange: (e) => updateTask(index, 'dailyHours', { [day]: e.target.value })
                                    })
                                )
                            )
                        )
                    ),
                    e('tr', { className: 'bg-gray-50 font-bold' },
                        e('td', { colSpan: 6, className: 'border p-2 text-right' }, 'Daily Totals:'),
                        ...days.map(day => 
                            e('td', { key: day, className: 'border p-2 text-center' },
                                calculateDailyTotal(day)
                            )
                        )
                    )
                )
            ),

            // Unforeseen Tasks Table
            e('h2', { className: 'text-xl font-bold mt-8 mb-4' }, 'Unforeseen Tasks'),
            e('table', { className: 'w-full border-collapse mb-6' },
                e('thead', null,
                    e('tr', { className: 'bg-gray-50' },
                        e('th', { className: 'border p-2' }, '#'),
                        e('th', { className: 'border p-2' }, 'Unforeseen Task Description'),
                        e('th', { className: 'border p-2' }, 'Hours')
                    )
                ),
                e('tbody', null,
                    unforeseenTasks.map((task, index) => 
                        e('tr', { key: `unforeseen-${index}` },
                            e('td', { className: 'border p-2' }, task.id),
                            e('td', { className: 'border p-2' },
                                e('input', {
                                    type: 'text',
                                    className: 'w-full p-1 border rounded',
                                    value: task.description,
                                    onChange: (e) => updateUnforeseenTask(index, 'description', e.target.value)
                                })
                            ),
                            e('td', { className: 'border p-2' },
                                e('input', {
                                    type: 'number',
                                    className: 'p-1 border rounded',
                                    value: task.hours,
                                    onChange: (e) => updateUnforeseenTask(index, 'hours', e.target.value)
                                })
                            )
                        )
                    )
                )
            ),

            // Totals Section
            e('div', { className: 'grid grid-cols-3 gap-4 mb-6' },
                e('div', { className: 'bg-gray-50 p-4 rounded' },
                    e('div', { className: 'text-sm font-medium' }, 'Total Weekly Hours'),
                    e('div', { className: 'text-2xl font-bold text-blue-600' },
                        calculateWeeklyTotal()
                    )
                ),
                e('div', { className: 'bg-gray-50 p-4 rounded' },
                    e('div', { className: 'text-sm font-medium' }, 'Unforeseen Hours'),
                    e('div', { className: 'text-2xl font-bold text-blue-600' },
                        calculateUnforeseenTotal()
                    )
                ),
                e('div', { className: 'bg-gray-50 p-4 rounded' },
                    e('div', { className: 'text-sm font-medium' }, 'Grand Total Hours'),
                    e('div', { className: 'text-2xl font-bold text-blue-600' },
                        calculateGrandTotal()
                    )
                )
            ),

            // User Info Section
            e('div', { className: 'bg-gray-50 p-4 rounded' },
                e('div', { className: 'grid grid-cols-3 gap-4 mb-4' },
                    e('div', null,
                        e('label', { className: 'block text-sm font-medium mb-1' }, 'Your Name'),
                        e('input', {
                            type: 'text',
                            className: 'w-full p-2 border rounded',
                            value: userInfo.name,
                            onChange: (e) => setUserInfo({...userInfo, name: e.target.value})
                        })
                    ),
                    e('div', null,
                        e('label', { className: 'block text-sm font-medium mb-1' }, 'Your Email'),
                        e('input', {
                            type: 'email',
                            className: 'w-full p-2 border rounded',
                            value: userInfo.email,
                            onChange: (e) => setUserInfo({...userInfo, email: e.target.value})
                        })
                    ),
                    e('div', null,
                        e('label', { className: 'block text-sm font-medium mb-1' }, 'Manager\'s Email'),
                        e('input', {
                            type: 'email',
                            className: 'w-full p-2 border rounded',
                            value: userInfo.managerEmail,
                            onChange: (e) => setUserInfo({...userInfo, managerEmail: e.target.value})
                        })
                    )
                ),
                e('div', { className: 'flex justify-end' },
                    e('button', {
                        className: 'bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600',
                        onClick: handleSubmit
                    }, 'Submit Task Plan')
                )
            )
        )
    );
}

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(TaskPlanner));
