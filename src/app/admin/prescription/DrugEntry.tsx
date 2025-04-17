import { FaHospital, FaPlus, FaPrint, FaTimes } from "react-icons/fa";

// Define types for our state
type Dosage = {
  id: number;
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
  durationValue: string;
  durationUnit: string;
  mealTime: string;
  note: string;
};

export type Drug = {
  id: number;
  name: string;
  dosages: Dosage[];
};

function DrugEntry({
  drug,
  onRemove,
  isRemovable,
  bgColor,
  onDrugChange,
}: {
  drug: Drug;
  onRemove: () => void;
  isRemovable: boolean;
  bgColor: string;
  onDrugChange: (updatedDrug: Drug) => void;
}) {
  const addDosage = () => {
    const newDosage: Dosage = {
      id: Date.now(),
      morning: "0",
      afternoon: "0",
      evening: "0",
      night: "0",
      durationValue: "1",
      durationUnit: "Days",
      mealTime: "Before/After Meal",
      note: "",
    };
    onDrugChange({
      ...drug,
      dosages: [...drug.dosages, newDosage],
    });
  };

  const removeDosage = (id: number) => {
    onDrugChange({
      ...drug,
      dosages: drug.dosages.filter((d) => d.id !== id),
    });
  };

  const updateDosage = (id: number, field: keyof Dosage, value: string) => {
    onDrugChange({
      ...drug,
      dosages: drug.dosages.map((dosage) =>
        dosage.id === id ? { ...dosage, [field]: value } : dosage
      ),
    });
  };

  return (
    <div className={`p-2 flex flex-col gap-3 relative ${bgColor}`}>
      {isRemovable && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <FaTimes />
        </button>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          className="border border-gray-300 p-2 w-1/3 min-w-[200px]"
          value={drug.name}
          onChange={(e) => onDrugChange({ ...drug, name: e.target.value })}
        >
          <option value="">Select Drug</option>
          <option value="Avil">Avil</option>
          {/* Add more drug options here */}
        </select>
      </div>

      {drug.dosages.map((dosage, index) => (
        <div key={dosage.id} className="flex flex-col gap-2 rounded">
          <div className="flex flex-nowrap gap-2">
            {["morning", "afternoon", "evening", "night"].map((time) => (
              <select
                key={time}
                className="border border-gray-300 p-2 rounded-md w-1/4"
                value={dosage[time as keyof Dosage]}
                onChange={(e) =>
                  updateDosage(dosage.id, time as keyof Dosage, e.target.value)
                }
              >
                {[
                  "0",
                  "½",
                  "1",
                  "2",
                  "3",
                  "4",
                  "0.5 ml",
                  "1 ml",
                  "2 ml",
                  "3 ml",
                  "4 ml",
                  "5 ml",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-2">
            <div className="flex w-full md:w-auto gap-2">
              <select
                className="border border-gray-300 p-2 rounded-md flex-1"
                value={dosage.durationValue}
                onChange={(e) =>
                  updateDosage(dosage.id, "durationValue", e.target.value)
                }
              >
                {[...Array(31).keys()].map((num) => (
                  <option key={num} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>

              <select
                className="border border-gray-300 p-2 rounded-md flex-1"
                value={dosage.durationUnit}
                onChange={(e) =>
                  updateDosage(dosage.id, "durationUnit", e.target.value)
                }
              >
                <option value="Days">Days</option>
                <option value="Months">Months</option>
                <option value="Years">Years</option>
              </select>
            </div>

            <select
              className="border border-gray-300 p-2 rounded-md flex-1 w-full md:w-auto"
              value={dosage.mealTime}
              onChange={(e) =>
                updateDosage(dosage.id, "mealTime", e.target.value)
              }
            >
              <option value="Before/After Meal">Before/After Meal</option>
              <option value="Before Meal">Before Meal</option>
              <option value="After Meal">After Meal</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter Note"
              className="border border-gray-300 p-2 rounded-md flex-1"
              value={dosage.note}
              onChange={(e) => updateDosage(dosage.id, "note", e.target.value)}
            />

            {index !== 0 && (
              <button
                onClick={() => removeDosage(dosage.id)}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-red-100 text-red-700 hover:bg-red-200"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={addDosage}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
      >
        <FaPlus /> Add Dosage
      </button>
    </div>
  );
}

export default DrugEntry;





