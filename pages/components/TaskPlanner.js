import React, { useState } from 'react';

const TaskPlanner = () => {
  const [tasks, setTasks] = useState(Array(40).fill(null).map((_, index) => ({
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

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    managerEmail: ''
  });

  const days = [
    { label: 'Mon', tasks: 'Mon Tasks', hours: 'Mon Hours' },
    { label: 'Tue', tasks: 'Tue Tasks', hours: 'Tue Hours' },
    { label: 'Wed', tasks: 'Wed Tasks', hours: 'Wed Hours' },
    { label: 'Thurs', tasks: 'Thurs Tasks', hours: 'Thurs Hours' },
    { label: 'Fri', tasks: 'Fri Tasks', hours: 'Fri Hours' },
    { label: 'Sat', tasks: 'Sat Tasks', hours: 'Sat Hours' },
    { label: 'Sun', tasks: 'Sun Tasks', hours: 'Sun Hours' }
  ];

  const updateTask = (index, field, value) => {
    const newTasks = [...tasks];
    if (field === 'dailyHours') {
      newTasks[index].dailyHours = { ...newTasks[index].dailyHours, ...value };
    } else {
      newTasks[index][field] = value;
    }
    setTasks(newTasks);
  };

  const calculateDailyTotal = (day) => {
    return tasks.reduce((sum, task) => {
      const hours = parseFloat(task.dailyHours[day]) || 0;
      return sum + hours;
    }, 0).toFixed(1);
  };

  const calculateWeeklyTotal = () => {
    return tasks.reduce((sum, task) => {
      const dailyTotal = Object.values(task.dailyHours).reduce((daySum, hours) => {
        return daySum + (parseFloat(hours) || 0);
      }, 0);
      return sum + dailyTotal;
    }, 0).toFixed(1);
  };

  const handleSubmit = async () => {
    if (!userInfo.name || !userInfo.email || !userInfo.managerEmail) {
      alert('Please fill in your name, email, and manager\'s email before submitting.');
      return;
    }

    const data = {
      userInfo,
      tasks,
      totals: {
        weeklyTotal: calculateWeeklyTotal(),
        dailyTotals: days.reduce((acc, day) => ({
          ...acc,
          [day.label]: calculateDailyTotal(day.label)
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
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Weekly Task Planner</h1>
          <div className="text-sm text-gray-500">* Include all work that requires a minimum of .5 hours</div>
        </div>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 w-12">#</th>
                <th className="border p-2 w-64">Task Description</th>
                <th className="border p-2 w-24">Duration (Hours)</th>
                <th className="border p-2 w-20">Mandatory</th>
                <th className="border p-2 w-20">Complete</th>
                <th className="border p-2 w-20">Defer</th>
                {days.map(day => (
                  <th key={day.label} className="border p-2">
                    <div className="font-medium">{day.label}</div>
                    <div className="text-xs font-normal mt-1">Hours</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => (
                <tr 
                  key={task.id}
                  className={`
                    ${task.taskColor === 'yellow' ? 'bg-yellow-50' : 'bg-green-50'}
                    hover:bg-opacity-80 transition-colors
                  `}
                >
                  <td className="border p-2 text-center text-gray-600">{task.id}</td>
                  <td className="border p-1">
                    <input
                      type="text"
                      className="w-full p-1 rounded border-gray-200 bg-white/50"
                      value={task.description}
                      onChange={(e) => updateTask(index, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border p-1">
                    <input
                      type="number"
                      className="w-full p-1 rounded border-gray-200 bg-white/50"
                      value={task.duration}
                      onChange={(e) => updateTask(index, 'duration', e.target.value)}
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={task.isMandatory}
                      onChange={(e) => updateTask(index, 'isMandatory', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={task.isComplete}
                      onChange={(e) => updateTask(index, 'isComplete', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  <td className="border p-2 text-center">
                    <input
                      type="checkbox"
                      checked={task.isDeferred}
                      onChange={(e) => updateTask(index, 'isDeferred', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </td>
                  {days.map(day => (
                    <td key={day.label} className="border p-1">
                      <input
                        type="number"
                        className="w-full p-1 rounded border-gray-200 bg-white/50"
                        value={task.dailyHours[day.label]}
                        onChange={(e) => updateTask(index, 'dailyHours', { [day.label]: e.target.value })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-medium">
                <td colSpan="6" className="border p-2 text-right">Daily Totals:</td>
                {days.map(day => (
                  <td key={day.label} className="border p-2 text-center">
                    {calculateDailyTotal(day.label)}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>

          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium">Total Weekly Hours:</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{calculateWeeklyTotal()}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium">Unforeseen Hours:</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">0</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium">Grand Total Hours:</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{calculateWeeklyTotal()}</div>
            </div>
          </div>

          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...u
