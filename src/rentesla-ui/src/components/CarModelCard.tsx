import { CarModelDto } from "../types/ApiResults";
import { getImageForCarModel } from "../utils/carImageMap";

export const CarModelCard = ({ model }: { model: CarModelDto }) => (
    <div
        key={model.id}
        className="group relative overflow-hidden rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-md"
    >
        <div className="aspect-w-3 aspect-h-2">
            <img
                src={getImageForCarModel(model.name)}
                alt={model.name}
                className="w-full h-56 object-cover" />
        </div>

        <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {model.name}
            </h3>
            
            <div className="flex justify-between items-center">
                <div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Daily</span>
                    <p className="text-xl font-bold dark:text-white">€{model.baseDailyRate}</p>
                </div>
                <div className="text-right">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Hourly</span>
                    <p className="text-xl font-bold dark:text-white">€{model.baseDailyRate / 10}</p>
                </div>
            </div>
        </div>
    </div>
);