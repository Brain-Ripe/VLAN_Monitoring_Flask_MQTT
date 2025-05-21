import React, { useEffect, useRef, useState } from 'react';
import { useNetwork } from '../../context/NetworkContext';

const NetworkTopology: React.FC = () => {
  const { 
    filteredNodes, 
    filteredLinks, 
    vlans, 
    selectedVlan, 
    setSelectedVlan, 
    selectedDevice, 
    setSelectedDevice 
  } = useNetwork();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [centerX, setCenterX] = useState(dimensions.width / 2);
  const [centerY, setCenterY] = useState(dimensions.height / 2);
  
  // Update canvas dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        setCenterX(width / 2);
        setCenterY(height / 2);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw the network on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Apply zoom and centering
    ctx.translate(centerX, centerY);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);

    // Draw links
    filteredLinks.forEach(link => {
      const sourceNode = filteredNodes.find(node => node.id === link.source);
      const targetNode = filteredNodes.find(node => node.id === link.target);
      
      if (!sourceNode || !targetNode) return;
      
      const startX = sourceNode.x;
      const startY = sourceNode.y;
      const endX = targetNode.x;
      const endY = targetNode.y;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      
      // Style based on VLAN and strength
      const vlan = vlans.find(v => v.id === link.vlanId);
      
      if (link.vlanId === 0) {
        // Cross-VLAN connection
        ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
        ctx.setLineDash([5, 3]);
      } else if (vlan) {
        ctx.strokeStyle = `${vlan.color}${Math.round(link.strength * 90 + 10).toString(16)}`;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
        ctx.setLineDash([]);
      }
      
      ctx.lineWidth = link.strength * 3;
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw animated pulses on links for traffic visualization
      if (Math.random() > 0.7) {
        const pulse = Math.random();
        const midX = startX + (endX - startX) * pulse;
        const midY = startY + (endY - startY) * pulse;
        
        ctx.beginPath();
        ctx.arc(midX, midY, 3, 0, Math.PI * 2);
        ctx.fillStyle = vlan ? vlan.color : 'rgba(200, 200, 200, 0.7)';
        ctx.fill();
      }
    });

    // Draw nodes
    filteredNodes.forEach(node => {
      const nodeSize = node.id === selectedDevice || node.id === hoveredNodeId ? 18 : 15;
      
      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      
      // Fill based on VLAN
      const vlan = vlans.find(v => v.id === node.vlanId);
      const baseColor = vlan ? vlan.color : '#999999';
      
      // Node visualization by status
      let fillColor = baseColor;
      let strokeColor = baseColor;
      
      if (node.status === 'offline') {
        fillColor = '#ffffff';
        strokeColor = '#EF4444';
      } else if (node.status === 'warning') {
        strokeColor = '#F59E0B';
      } else if (node.status === 'maintenance') {
        strokeColor = '#6B7280';
      }
      
      // Highlight selected or hovered node
      if (node.id === selectedDevice || node.id === hoveredNodeId) {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3;
      } else {
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2;
      }
      
      ctx.fillStyle = fillColor;
      ctx.strokeStyle = strokeColor;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw node type icon
      ctx.fillStyle = node.status === 'offline' ? '#EF4444' : 'white';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let icon = '?';
      switch (node.type) {
        case 'router': icon = 'R'; break;
        case 'switch': icon = 'S'; break;
        case 'accessPoint': icon = 'A'; break;
        case 'sensor': icon = 'Se'; break;
        case 'camera': icon = 'C'; break;
        case 'controller': icon = 'Co'; break;
      }
      
      ctx.fillText(icon, node.x, node.y);
      
      // Draw label if selected or hovered
      if (node.id === selectedDevice || node.id === hoveredNodeId) {
        const label = node.label;
        
        // Draw label background
        const textWidth = ctx.measureText(label).width + 10;
        const textHeight = 20;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.roundRect(
          node.x - textWidth / 2,
          node.y + nodeSize + 5,
          textWidth,
          textHeight,
          4
        );
        ctx.fill();
        
        // Draw label text
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.fillText(label, node.x, node.y + nodeSize + 15);
      }
    });
    
    ctx.restore();
  }, [filteredNodes, filteredLinks, vlans, selectedVlan, selectedDevice, hoveredNodeId, dimensions, zoom, centerX, centerY]);

  // Add roundRect to CanvasRenderingContext2D prototype if not exists
  useEffect(() => {
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height,radius) {
        radius = (height+width) / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + width, y, x + width, y + height, radius);
        this.arcTo(x + width, y + height, x, y + height, radius);
        this.arcTo(x, y + height, x, y, radius);
        this.arcTo(x, y, x + width, y, radius);
        this.closePath();
        return this;
      };
    }
  }, []);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    // Check if a node was clicked
    const clickedNode = filteredNodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance <= 15;
    });
    
    if (clickedNode) {
      setIsDragging(true);
      setDraggedNodeId(clickedNode.id);
      setSelectedDevice(clickedNode.id);
    } else {
      setSelectedDevice(null);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    // Update hovered node
    const hoveredNode = filteredNodes.find(node => {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
      return distance <= 15;
    });
    
    setHoveredNodeId(hoveredNode ? hoveredNode.id : null);
    
    // Move dragged node
    if (isDragging && draggedNodeId) {
      const nodeIndex = filteredNodes.findIndex(node => node.id === draggedNodeId);
      if (nodeIndex !== -1) {
        const updatedNodes = [...filteredNodes];
        updatedNodes[nodeIndex] = {
          ...updatedNodes[nodeIndex],
          x,
          y
        };
      }
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggedNodeId(null);
  };
  
  const handleMouseLeave = () => {
    setHoveredNodeId(null);
    handleMouseUp();
  };
  
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.min(Math.max(0.5, prev + delta), 2));
  };

  return (
    <div className="h-full relative" ref={containerRef}>
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedVlan(null)}
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            selectedVlan === null 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }`}
        >
          All VLANs
        </button>
        
        {vlans.map(vlan => (
          <button
            key={vlan.id}
            onClick={() => setSelectedVlan(vlan.id === selectedVlan ? null : vlan.id)}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              vlan.id === selectedVlan 
                ? 'text-white' 
                : `text-gray-700 dark:text-gray-300 bg-opacity-20 dark:bg-opacity-20`
            }`}
            style={{ 
              backgroundColor: vlan.id === selectedVlan ? vlan.color : `${vlan.color}30`,
              borderColor: vlan.color
            }}
          >
            {vlan.name} ({vlan.id})
          </button>
        ))}
      </div>
      
      <div className="absolute bottom-4 right-4 z-10 flex space-x-2">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300"
        >
          +
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300"
        >
          -
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setCenterX(dimensions.width / 2);
            setCenterY(dimensions.height / 2);
          }}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md text-gray-700 dark:text-gray-300 text-xs"
        >
          Reset
        </button>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab bg-white dark:bg-gray-900"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
      />
    </div>
  );
};

export default NetworkTopology;