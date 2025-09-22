import { Mail } from "lucide-react";

export const NoEmailSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <div className="w-28 h-28 mb-6 rounded-full border-2 border-dashed border-gray-500 flex items-center justify-center">
        <Mail className="w-12 h-12 opacity-50" />
      </div>
      <h2 className="text-lg font-semibold">It's empty here</h2>
      <p className="text-sm mb-6">Choose an email to view details</p>
      <div className="flex items-center justify-center space-y-2">
        <button className="flex items-center gap-2 px-3 py-1 border border-gray-500 bg-[#313131] text-gray-300 rounded-md text-sm  cursor-pointer">
          <Mail className="w-4 h-4 text-gray-400" />
          Send email
        </button>
      </div>
    </div>
  );
};