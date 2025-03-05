import React from 'react';

interface CourseItem {
  title: string;
  provider: string;
  category: string;
  date: string;
  image: string;
}

interface CourseCardProps {
  item: CourseItem;
}

const CourseCard: React.FC<CourseCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <div className="h-48 bg-gray-200 relative">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">Curso Destacado</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        <div className="flex items-center mb-2">
          <div className="flex-shrink-0 w-4 h-4 border border-gray-300 mr-2"></div>
          <span className="text-sm text-gray-600">{item.provider}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs px-3 py-1 bg-blue-100 rounded-full text-blue-600">
            {item.category}
          </span>
          <span className="text-xs text-gray-500">{item.date}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
