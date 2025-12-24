import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, ReferenceDot } from 'recharts';

interface Birthday {
  month: number;
  day: number;
  id: number;
}

export default function BirthdayParadox() {
  const [n, setN] = useState(23);
  const [activeTab, setActiveTab] = useState<'simulation' | 'math'>('simulation');
  const [simulation, setSimulation] = useState<Birthday[]>([]);
  const [matchFound, setMatchFound] = useState<{ found: boolean; matches: number[][] }>({ found: false, matches: [] });

  // Generate random birthdays
  const generateBirthdays = (count: number): Birthday[] => {
    const birthdays: Birthday[] = [];
    for (let i = 0; i < count; i++) {
      const month = Math.floor(Math.random() * 12) + 1;
      const daysInMonth = new Date(2024, month, 0).getDate();
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      birthdays.push({ month, day, id: i });
    }
    return birthdays;
  };

  // Check for matches
  const findMatches = (birthdays: Birthday[]): { found: boolean; matches: number[][] } => {
    const matches: number[][] = [];
    const seen = new Map<string, number[]>();

    birthdays.forEach((bday, idx) => {
      const key = `${bday.month}-${bday.day}`;
      if (seen.has(key)) {
        seen.get(key)!.push(idx);
        if (seen.get(key)!.length === 2) {
          matches.push(seen.get(key)!);
        }
      } else {
        seen.set(key, [idx]);
      }
    });

    return { found: matches.length > 0, matches };
  };

  // Run simulation
  const runSimulation = () => {
    const birthdays = generateBirthdays(n);
    const matchResult = findMatches(birthdays);
    setSimulation(birthdays);
    setMatchFound(matchResult);
  };

  // Calculate probability for given n
  const calculateProbability = (people: number): number => {
    if (people > 365) return 1;
    if (people <= 1) return 0;
    
    let probability = 1;
    for (let i = 0; i < people; i++) {
      probability *= (365 - i) / 365;
    }
    return (1 - probability) * 100;
  };

  // Generate data for chart
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 1; i <= 100; i++) {
      data.push({
        people: i,
        probability: calculateProbability(i),
      });
    }
    return data;
  }, []);

  // Get current probability
  const currentProbability = useMemo(() => calculateProbability(n), [n]);

  // Format date
  const formatDate = (month: number, day: number): string => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[month - 1]} ${day}`;
  };

  // Get all matched indices
  const allMatchedIndices = useMemo(() => {
    const indices = new Set<number>();
    matchFound.matches.forEach(match => {
      match.forEach(idx => indices.add(idx));
    });
    return indices;
  }, [matchFound.matches]);

  return (
    <>
      <style>{`
        .birthday-paradox {
          width: 100%;
          padding: 2rem;
          background: rgba(39, 39, 42, 0.5);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #ffffff;
        }

        .controls {
          margin-bottom: 2rem;
        }

        .slider-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .slider-label {
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          min-width: 120px;
        }

        .slider {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          background: rgba(0, 255, 255, 0.9);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: rgba(0, 255, 255, 0.9);
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .slider-value {
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 1rem;
          color: rgba(0, 255, 255, 0.9);
          min-width: 40px;
          text-align: right;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        .tab.active {
          color: #00ffff;
          border-bottom-color: rgba(0, 255, 255, 0.6);
        }

        .simulation-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .simulation-button {
          padding: 0.75rem 1.5rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 0.5rem;
          color: #00ffff;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .simulation-button:hover {
          background: rgba(0, 255, 255, 0.2);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
        }

        .match-status {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
        }

        .match-status.match {
          border: 1px solid rgba(0, 255, 255, 0.5);
          color: #00ffff;
        }

        .match-status.no-match {
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.7);
        }

        .birthday-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 0.75rem;
          position: relative;
        }

        .birthday-square {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
          position: relative;
        }

        .birthday-square.matched {
          background: rgba(0, 255, 255, 0.2);
          border-color: rgba(0, 255, 255, 0.6);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
          }
        }

        .birthday-square .month {
          font-size: 0.6rem;
          opacity: 0.8;
        }

        .birthday-square .day {
          font-size: 0.85rem;
          font-weight: 600;
        }

        .math-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 0.5rem;
          padding: 1.5rem;
        }

        .formula-section {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .formula-title {
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .formula {
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 0.875rem;
          color: rgba(0, 255, 255, 0.9);
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .formula-explanation {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .birthday-paradox {
            padding: 1.5rem;
          }

          .slider-container {
            flex-direction: column;
            align-items: stretch;
          }

          .birthday-grid {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
            gap: 0.5rem;
          }
        }
      `}</style>
      <div className="birthday-paradox">
        <div className="controls">
          <div className="slider-container">
            <label className="slider-label">Number of People (n):</label>
            <input
              type="range"
              min="1"
              max="100"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className="slider"
            />
            <span className="slider-value">{n}</span>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            Simulation
          </button>
          <button
            className={`tab ${activeTab === 'math' ? 'active' : ''}`}
            onClick={() => setActiveTab('math')}
          >
            Math
          </button>
        </div>

        {activeTab === 'simulation' && (
          <div className="simulation-content">
            <button className="simulation-button" onClick={runSimulation}>
              Run Simulation
            </button>

            {simulation.length > 0 && (
              <>
                <div className={`match-status ${matchFound.found ? 'match' : 'no-match'}`}>
                  In this specific simulation: <strong>{matchFound.found ? 'Match Found' : 'No Match'}</strong>
                </div>

                <div className="birthday-grid">
                  {simulation.map((bday, idx) => (
                    <div
                      key={bday.id}
                      className={`birthday-square ${allMatchedIndices.has(idx) ? 'matched' : ''}`}
                      title={formatDate(bday.month, bday.day)}
                    >
                      <span className="month">{bday.month}/{bday.day}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'math' && (
          <div className="math-content">
            <div className="chart-container">
              <LineChart
                width={800}
                height={400}
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis
                  dataKey="people"
                  stroke="rgba(255, 255, 255, 0.6)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                  label={{ value: 'Number of People', position: 'insideBottom', offset: -5, fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <YAxis
                  stroke="rgba(255, 255, 255, 0.6)"
                  tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                  label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(39, 39, 42, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.5rem',
                    color: '#ffffff',
                  }}
                />
                <ReferenceLine y={50} stroke="rgba(0, 255, 255, 0.5)" strokeDasharray="5 5" label={{ value: '50%', position: 'right', fill: 'rgba(0, 255, 255, 0.8)' }} />
                <Line
                  type="monotone"
                  dataKey="probability"
                  stroke="#00ffff"
                  strokeWidth={2}
                  dot={false}
                  name="Probability"
                />
                <ReferenceDot
                  x={n}
                  y={currentProbability}
                  r={8}
                  fill="#00ffff"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </LineChart>
            </div>

            <div className="formula-section">
              <div className="formula-title">The Birthday Paradox Formula</div>
              <div className="formula">
                P(match) = 1 - (365! / (365^n × (365-n)!))
              </div>
              <div className="formula-explanation">
                This formula calculates the probability that at least two people share a birthday in a group of n people.
                The counterintuitive result is that with just 23 people, there's approximately a 50% chance of a match.
                The formula works by calculating the probability that all birthdays are unique (the complement), then
                subtracting from 1. The 50% threshold occurs around n=23, which is much lower than most people expect.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

