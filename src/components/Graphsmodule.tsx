import { useState, ReactNode } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { InfoIcon } from "lucide-react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

interface DashboardProps {
  benefitsValues: { [key: string]: number };
  liabilitiesValues: { [key: string]: number };
}

const Card = ({ children, className }: CardProps) => (
  <div className={`border rounded-lg shadow-lg p-4 ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: ReactNode }) => <div className="mb-4">{children}</div>;
const CardTitle = ({ children }: { children: ReactNode }) => <h2 className="text-xl font-bold">{children}</h2>;
const CardContent = ({ children }: { children: ReactNode }) => <div>{children}</div>;

const Alert = ({ children }: { children: ReactNode }) => (
  <div className="bg-blue-100 border border-blue-300 text-blue-700 rounded-lg p-4 flex items-start space-x-2">
    {children}
  </div>
);

const AlertDescription = ({ children }: { children: ReactNode }) => <span className="text-sm">{children}</span>;

const GraphModule = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const analysisData = JSON.parse(localStorage.getItem('analysis') || '{}');

  const handleClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="mb-8 relative">
      <button
        onClick={handleClick}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        View Detailed Nutrition Analysis
      </button>

      {isModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Nutrient Analysis Dashboard</h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
                <div className="overflow-y-auto max-h-[80vh]">
                  <Dashboard 
                    benefitsValues={analysisData[1] || {}} 
                    liabilitiesValues={analysisData[1] || {}}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const CustomizedDot = (props: { cx: number, cy: number, payload: any, isBenefits: boolean }) => {
  const { cx, cy, payload, isBenefits } = props;

  let fill = '#000';
  if (isBenefits) {
    if (payload.value >= payload.mediumThreshold) {
      fill = '#22c55e';
    } else if (payload.value >= payload.lowThreshold) {
      fill = '#eab308';
    } else {
      fill = '#ef4444';
    }
  } else {
    if (payload.value <= payload.lowThreshold) {
      fill = '#22c55e';
    } else if (payload.value <= payload.mediumThreshold) {
      fill = '#eab308';
    } else {
      fill = '#ef4444';
    }
  }

  return (
    <circle
      {...props}
      cx={cx} 
      cy={cy} 
      r={5} 
      stroke="white" 
      strokeWidth={2} 
      fill={fill} 
    />
  );
};

const Dashboard = ({ benefitsValues, liabilitiesValues }: DashboardProps) => {
  const defaultBenefits = {
    PROTEINS: [25, 15, 5],
    FIBER: [30, 20, 5],
    CALCIUM: [25, 15, 3],
    MAGNESIUM: [25, 15, 3],
    IRON: [20, 10, 4],
    ZINC: [25, 15, 3],
    IODINE: [20, 10, 3],
    THIAMINE: [15, 10, 2],
    RIBOFLAVIN: [20, 10, 2],
    NIACIN: [20, 10, 2],
    VITAMIN_B6: [20, 10, 2],
    FOLATE: [30, 15, 3],
    VITAMIN_B12: [30, 15, 3],
    VITAMIN_C: [20, 10, 4],
    VITAMIN_A: [30, 20, 5],
    VITAMIN_D: [25, 15, 3],
    ENERGY: [20, 10, 4],
    CARBOHYDRATES: [25, 12, 3],
  };

  const defaultLiabilities = {
    SUGAR: [15, 25, 4],
    TOTAL_FAT: [20, 30, 4],
    SATURATED_FAT: [5, 12, 3],
    SODIUM: [20, 30, 2],
    CHOLESTEROL: [10, 20, 4],
  };

  const benefitsData = Object.entries(defaultBenefits).map(([name, [max, medium, low]]) => ({
    name,
    value: benefitsValues[name] || 0,
    mediumThreshold: medium,
    lowThreshold: low,
    idealRange: `${medium}-${max}`,
    acceptableRange: `${low}-${medium}`,
    belowRange: `<${low}`,
  }))
  .filter((data) => data.value !== 0);;

  const liabilitiesData = Object.entries(defaultLiabilities)
  .map(([name, [ideal, warning, low]]) => ({
    name,
    value: liabilitiesValues[name] || 0,
    mediumThreshold: warning,
    lowThreshold: low,
    idealRange: `<${ideal}`,
    warningRange: `${ideal}-${warning}`,
    dangerRange: `>${warning}`,
  }))
  .filter((data) => data.value !== 0);;

  const CustomTooltip = (props: { active?: boolean; payload?: any[]; label?: string; isBenefits: boolean }) => {
    const { active, payload, isBenefits } = props;
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold mb-2">{data.name}</p>
          <p className="text-blue-600">Current Value: {data.value}</p>
          {isBenefits ? (
            <>
              <p className="text-green-600">Ideal Range: {data.idealRange}</p>
              <p className="text-yellow-600">Acceptable Range: {data.acceptableRange}</p>
              <p className="text-red-600">Below Range: {data.belowRange}</p>
            </>
          ) : (
            <>
              <p className="text-green-600">Ideal Range: {data.idealRange}</p>
              <p className="text-yellow-600">Warning Range: {data.warningRange}</p>
              <p className="text-red-600">Danger Range: {data.dangerRange}</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Benefits Chart</CardTitle>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Green zone indicates ideal levels, yellow zone indicates acceptable levels, and red zone indicates deficiency risk.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] overflow-x-auto">
            <LineChart
              width={1000}
              height={400}
              data={benefitsData}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60}>
                <text x={50} y={20} textAnchor="middle" className="text-black font-semibold">Nutrient</text>
              </XAxis>
              <YAxis label={{ value: "RDA %", angle: -90, position: "insideLeft" }} ticks={[0, 5, 10, 15, 20, 25, 30]} />
              <Tooltip content={<CustomTooltip isBenefits={true} />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="rgba(54, 162, 235, 1)" strokeWidth={2} dot={(props) => <CustomizedDot {...props} isBenefits={true} />} />
            </LineChart>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liabilities Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[400px] overflow-x-auto">
            <LineChart
              width={1000}
              height={400}
              data={liabilitiesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60}>
                <text x={50} y={20} textAnchor="middle" className="text-black font-semibold">Nutrient</text>
              </XAxis>
              <YAxis label={{ value: "RDA %", angle: -90, position: "insideLeft" }} ticks={[0, 5, 10, 15, 20, 25, 30]} />
              <Tooltip content={<CustomTooltip isBenefits={false} />} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="rgba(255, 99, 132, 1)" strokeWidth={2} dot={(props) => <CustomizedDot {...props} isBenefits={false} />} />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraphModule;
