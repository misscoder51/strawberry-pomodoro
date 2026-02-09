import React, { useMemo } from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ show, onClose, progressData }) => {
    if (!show) return null;

    // Calculate statistics
    const stats = useMemo(() => {
        const dates = Object.keys(progressData);
        const totalPomodoros = Object.values(progressData).reduce((sum, count) => sum + count, 0);

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            if (progressData[dateStr] && progressData[dateStr] > 0) {
                currentStreak++;
            } else if (i > 0) {
                break;
            }
        }

        // Calculate best streak
        let bestStreak = 0;
        let tempStreak = 0;
        const sortedDates = dates.sort();
        for (let i = 0; i < sortedDates.length; i++) {
            if (progressData[sortedDates[i]] > 0) {
                tempStreak++;
                bestStreak = Math.max(bestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        return { totalPomodoros, currentStreak, bestStreak };
    }, [progressData]);

    // Generate last 12 weeks of dates
    const heatmapData = useMemo(() => {
        const weeks = [];
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 83); // 12 weeks = 84 days

        for (let week = 0; week < 12; week++) {
            const weekData = [];
            for (let day = 0; day < 7; day++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + (week * 7) + day);
                const dateStr = date.toISOString().split('T')[0];
                const count = progressData[dateStr] || 0;
                weekData.push({
                    date: dateStr,
                    count,
                    displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                });
            }
            weeks.push(weekData);
        }
        return weeks;
    }, [progressData]);

    // Get color based on count
    const getColor = (count) => {
        if (count === 0) return 'var(--heatmap-empty)';
        if (count <= 2) return 'var(--heatmap-low)';
        if (count <= 4) return 'var(--heatmap-medium)';
        if (count <= 6) return 'var(--heatmap-high)';
        return 'var(--heatmap-highest)';
    };

    return (
        <div className="progress-overlay" onClick={onClose}>
            <div className="progress-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✕</button>

                <h2 className="progress-title">🍓 your progress</h2>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats.totalPomodoros}</div>
                        <div className="stat-label">total pomodoros</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.currentStreak}</div>
                        <div className="stat-label">current streak</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats.bestStreak}</div>
                        <div className="stat-label">best streak</div>
                    </div>
                </div>

                <div className="heatmap-container">
                    <div className="heatmap-label">last 12 weeks</div>
                    <div className="heatmap-grid">
                        <div className="day-labels">
                            <span>Mon</span>
                            <span>Wed</span>
                            <span>Fri</span>
                        </div>
                        <div className="heatmap-weeks">
                            {heatmapData.map((week, weekIndex) => (
                                <div key={weekIndex} className="heatmap-week">
                                    {week.map((day, dayIndex) => (
                                        <div
                                            key={dayIndex}
                                            className="heatmap-cell"
                                            style={{ backgroundColor: getColor(day.count) }}
                                            title={`${day.displayDate}: ${day.count} pomodoro${day.count !== 1 ? 's' : ''}`}
                                        >
                                            <span className="cell-tooltip">
                                                {day.displayDate}<br />
                                                {day.count} pomodoro{day.count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="heatmap-legend">
                        <span>Less</span>
                        <div className="legend-colors">
                            <div className="legend-cell" style={{ backgroundColor: 'var(--heatmap-empty)' }}></div>
                            <div className="legend-cell" style={{ backgroundColor: 'var(--heatmap-low)' }}></div>
                            <div className="legend-cell" style={{ backgroundColor: 'var(--heatmap-medium)' }}></div>
                            <div className="legend-cell" style={{ backgroundColor: 'var(--heatmap-high)' }}></div>
                            <div className="legend-cell" style={{ backgroundColor: 'var(--heatmap-highest)' }}></div>
                        </div>
                        <span>More</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;
