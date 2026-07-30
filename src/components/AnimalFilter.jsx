import React from 'react';

export default function AnimalFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { id: 'all', name: '全部動物' },
    { 
      id: 'plantigrade', 
      name: '蹠行類', 
      titleCh: '蹠行類',
      titleEn: '(Plantigrade)',
      description: '整個腳掌（腳趾＋腳跟）接觸地面，原始哺乳動物的基本型態。速度通常較慢，但能靈活運用四肢進行抓握或直立防禦等動作。例如人類、熊科、靈長類、齧齒目、食蟲目。'
    },
    { 
      id: 'digitigrade', 
      name: '趾行類', 
      titleCh: '趾行類',
      titleEn: '(Digitigrade)',
      description: '僅腳趾（腳跟懸空）接觸地面，為了速度與靜音捕食而演化。相當於墊腳尖走路，多出一節掌骨提升腿部槓桿的爆發力。例如貓科（貓、獅、虎）、犬科（狗、狼、狐狸）。'
    },
    { 
      id: 'unguligrade', 
      name: '蹄行類', 
      titleCh: '蹄行類',
      titleEn: '(Unguligrade)',
      description: '僅趾尖（蹄）接觸地面，為了逃避掠食者而演化。相當於用指甲在跑步，肢體最大程度延伸以達成省力高速移動。例如奇蹄目（馬、犀牛、貘）、偶蹄目（牛、羊、鹿、豬）。'
    }
  ];

  return (
    <div className="filter-container" style={{ position: 'relative', zIndex: 50 }}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-tab ${currentFilter === filter.id ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.id)}
          aria-label={filter.name}
        >
          {filter.name}
          {filter.description && (
            <span className="filter-tooltip">
              <span className="tooltip-title">
                {filter.titleCh} <span className="tooltip-title-en">{filter.titleEn}</span>
              </span>
              {filter.description}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
