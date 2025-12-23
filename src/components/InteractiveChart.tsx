import { useEffect, useRef, useState } from 'react';
import type { Data, Layout, Config } from 'plotly.js';

interface DataModel {
  name?: string;
  [key: string]: any;
}

interface InteractiveChartProps {
  dataModel?: DataModel;
}

export default function InteractiveChart({ dataModel }: InteractiveChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [PlotComponent, setPlotComponent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamically import Plotly only in the browser
  useEffect(() => {
    const loadPlotly = async () => {
      try {
        const Plot = (await import('react-plotly.js')).default;
        setPlotComponent(() => Plot);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Plotly:', error);
        setIsLoading(false);
      }
    };

    loadPlotly();
  }, []);

  // Generate mock 3D surface data for Loss Gradient
  const generateLossGradient = () => {
    const size = 50;
    const x: number[] = [];
    const y: number[] = [];
    const z: number[][] = [];

    for (let i = 0; i < size; i++) {
      x.push(i / size * 10 - 5);
      y.push(i / size * 10 - 5);
    }

    for (let i = 0; i < size; i++) {
      z.push([]);
      for (let j = 0; j < size; j++) {
        // Create a loss landscape with multiple minima
        const xVal = x[i];
        const yVal = y[j];
        const loss = 
          Math.pow(xVal, 2) + Math.pow(yVal, 2) + 
          0.5 * Math.sin(xVal * 2) * Math.cos(yVal * 2) +
          0.3 * Math.exp(-(Math.pow(xVal, 2) + Math.pow(yVal, 2)) / 2);
        z[i].push(loss);
      }
    }

    return { x, y, z };
  };

  const { x, y, z } = generateLossGradient();

  const data: Data[] = [
    {
      type: 'surface',
      x: x,
      y: y,
      z: z,
      colorscale: [
        [0, '#000000'],
        [0.2, '#001133'],
        [0.4, '#003366'],
        [0.6, '#0066cc'],
        [0.8, '#00aaff'],
        [1, '#00ffff'],
      ],
      showscale: false,
      lighting: {
        ambient: 0.4,
        diffuse: 0.6,
        specular: 0.2,
      },
      lightposition: {
        x: 100,
        y: 100,
        z: 1000,
      },
    } as any,
  ];

  const layout: Partial<Layout> = {
    autosize: true,
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    scene: {
      bgcolor: 'transparent',
      xaxis: {
        title: { text: 'Weight 1', font: { color: '#ffffff', size: 10, family: 'ui-monospace' } },
        tickfont: { color: '#888888', size: 9, family: 'ui-monospace' },
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        showbackground: false,
      } as any,
      yaxis: {
        title: { text: 'Weight 2', font: { color: '#ffffff', size: 10, family: 'ui-monospace' } },
        tickfont: { color: '#888888', size: 9, family: 'ui-monospace' },
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        showbackground: false,
      } as any,
      zaxis: {
        title: { text: 'Loss', font: { color: '#ffffff', size: 10, family: 'ui-monospace' } },
        tickfont: { color: '#888888', size: 9, family: 'ui-monospace' },
        gridcolor: 'rgba(255, 255, 255, 0.1)',
        showbackground: false,
      } as any,
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.2 },
      },
    },
  };

  const config: Partial<Config> = {
    displayModeBar: false,
    responsive: true,
    staticPlot: false,
  };

  // Show loading state while Plotly is being loaded
  if (isLoading || !PlotComponent) {
    return (
      <>
        <style>{`
          .chart-container {
            position: relative;
            width: 100%;
            height: 600px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(0, 255, 255, 0.3);
            border-radius: 0;
            padding: 1rem;
            box-shadow: 
              0 0 20px rgba(0, 255, 255, 0.1),
              inset 0 0 20px rgba(0, 255, 255, 0.05);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .chart-label {
            position: absolute;
            top: 1rem;
            left: 1rem;
            font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
            font-size: 0.75rem;
            font-weight: 600;
            color: rgba(0, 255, 255, 0.9);
            letter-spacing: 0.1em;
            text-transform: uppercase;
            z-index: 10;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
          }

          .loading-text {
            font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
            font-size: 0.875rem;
            color: rgba(255, 255, 255, 0.6);
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }

          @media (max-width: 768px) {
            .chart-container {
              height: 400px;
              padding: 0.75rem;
            }

            .chart-label {
              font-size: 0.65rem;
              top: 0.75rem;
              left: 0.75rem;
            }
          }
        `}</style>
        <div className="chart-container" ref={containerRef}>
          <div className="chart-label">Live Model Output</div>
          <div className="loading-text">Loading Model...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        .chart-container {
          position: relative;
          width: 100%;
          height: 600px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 0;
          padding: 1rem;
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.1),
            inset 0 0 20px rgba(0, 255, 255, 0.05);
          overflow: hidden;
        }

        .chart-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(0, 255, 255, 0.5) 20%, 
            rgba(0, 255, 255, 0.8) 50%, 
            rgba(0, 255, 255, 0.5) 80%, 
            transparent
          );
          animation: scan 3s linear infinite;
        }

        .chart-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, 
            transparent, 
            rgba(0, 255, 255, 0.3) 50%, 
            transparent
          );
        }

        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .chart-label {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(0, 255, 255, 0.9);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          z-index: 10;
          text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }

        .chart-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        @media (max-width: 768px) {
          .chart-container {
            height: 400px;
            padding: 0.75rem;
          }

          .chart-label {
            font-size: 0.65rem;
            top: 0.75rem;
            left: 0.75rem;
          }
        }
      `}</style>
      <div className="chart-container" ref={containerRef}>
        <div className="chart-label">Live Model Output</div>
        <div className="chart-wrapper">
          <PlotComponent
            data={data}
            layout={layout}
            config={config}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>
    </>
  );
}
