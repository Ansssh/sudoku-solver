export default function Numbers({ onNumberClick }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5,6,7,8,9].map((num) => (
        <div
          key={num}
          className="border-2 font-bold py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200"
          onClick={() => onNumberClick(num)}
        >
          {num}
        </div>
      ))}
      <div key={0} className="border-2 font-bold py-2 px-4 rounded-md cursor-pointer hover:bg-gray-200" onClick={() => onNumberClick()}><i class="ri-eraser-line"></i></div>
    </div>
  );
}
