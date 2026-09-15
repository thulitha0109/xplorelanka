import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Navbar from '../../Components/Navbar';
import Footer from '../../Components/Footer';
import { 
    Save, ArrowLeft, Image as ImageIcon, MapPin, 
    List, Settings, Video, FileText, Navigation, Tag
} from 'lucide-react';

export default function TourForm({ tour, isEdit }) {
    const [activeTab, setActiveTab] = useState('basic');

    const { data, setData, post, put, processing, errors } = useForm({
        title: tour?.title || '',
        slug: tour?.slug || '',
        category: tour?.category || 'cultural',
        route: tour?.route || '',
        duration: tour?.duration || '',
        price_lkr: tour?.price_lkr || '',
        price_usd: tour?.price_usd || '',
        difficulty: tour?.difficulty || 'easy',
        max_group_size: tour?.max_group_size || 15,
        is_featured: tour?.is_featured ?? false,
        is_active: tour?.is_active ?? true,
        
        description: tour?.description || '',
        seo_title: tour?.seo_title || '',
        seo_description: tour?.seo_description || '',
        
        image: tour?.image || '',
        video_url: tour?.video_url || '',
        gallery: tour?.gallery || [],
        
        tags: tour?.tags || [],
        highlights: tour?.highlights || [],
        itinerary: tour?.itinerary || [],
        waypoints: tour?.waypoints || [],
        
        map_center_lat: tour?.map_center_lat || 7.8731,
        map_center_lng: tour?.map_center_lng || 80.7718,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(`/admin/tours/${tour.id}`);
        } else {
            post('/admin/tours');
        }
    };

    // Array field helpers
    const addArrayItem = (field, defaultItem = '') => {
        setData(field, [...data[field], defaultItem]);
    };
    
    const updateArrayItem = (field, index, value) => {
        const newArray = [...data[field]];
        newArray[index] = value;
        setData(field, newArray);
    };
    
    const removeArrayItem = (field, index) => {
        const newArray = [...data[field]];
        newArray.splice(index, 1);
        setData(field, newArray);
    };

    // Itinerary specific
    const updateItinerary = (index, key, value) => {
        const newItin = [...data.itinerary];
        newItin[index] = { ...newItin[index], [key]: value };
        setData('itinerary', newItin);
    };

    // Waypoints specific
    const updateWaypoint = (index, key, value) => {
        const newWaypoints = [...data.waypoints];
        newWaypoints[index] = { ...newWaypoints[index], [key]: key === 'name' ? value : parseFloat(value) || 0 };
        setData('waypoints', newWaypoints);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: FileText },
        { id: 'media', label: 'Media & Location', icon: ImageIcon },
        { id: 'content', label: 'Highlights & Itinerary', icon: List },
        { id: 'settings', label: 'SEO & Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
            <Head title={isEdit ? `Edit Tour: ${tour.title}` : 'Create New Tour'} />
            <Navbar />

            <main className="flex-grow py-8 container mx-auto px-4 max-w-6xl">
                
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/admin/dashboard" className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black">{isEdit ? 'Edit Tour' : 'Create New Tour'}</h1>
                            <p className="text-sm text-slate-500">{isEdit ? tour.title : 'Fill in the details to publish a new package.'}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={processing}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{processing ? 'Saving...' : 'Save Tour'}</span>
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Tabs */}
                    <div className="lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sticky top-24">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                            isActive 
                                                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Form Area */}
                    <div className="flex-grow">
                        <form className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
                            
                            {/* BASIC INFO */}
                            <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <FileText className="w-5 h-5 text-amber-500" />
                                    <span>Basic Information</span>
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Tour Title *</label>
                                        <input type="text" value={data.title} onChange={e => {
                                            setData('title', e.target.value);
                                            if (!isEdit) setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                                        }} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800 focus:ring-2 focus:ring-amber-500" />
                                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">URL Slug *</label>
                                        <input type="text" value={data.slug} onChange={e => setData('slug', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800 font-mono text-sm" />
                                        {errors.slug && <p className="text-red-500 text-xs">{errors.slug}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Category *</label>
                                        <select value={data.category} onChange={e => setData('category', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800">
                                            <option value="cultural">Cultural Triangle</option>
                                            <option value="nature">Hill Country</option>
                                            <option value="wildlife">Wildlife Safaris</option>
                                            <option value="beach">Coastal & Beaches</option>
                                            <option value="adventure">Adventure</option>
                                            <option value="day">Day Trips</option>
                                            <option value="camping">Wilderness Camping</option>
                                            <option value="private">Private & Luxury</option>
                                        </select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Price LKR *</label>
                                        <input type="number" value={data.price_lkr} onChange={e => setData('price_lkr', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                        {errors.price_lkr && <p className="text-red-500 text-xs">{errors.price_lkr}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Price USD (optional)</label>
                                        <input type="number" value={data.price_usd} onChange={e => setData('price_usd', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Duration *</label>
                                        <input type="text" placeholder="e.g. 5 Days / 4 Nights" value={data.duration} onChange={e => setData('duration', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Base Route *</label>
                                        <input type="text" placeholder="e.g. Colombo - Kandy - Ella" value={data.route} onChange={e => setData('route', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Main Description *</label>
                                        <textarea rows="6" value={data.description} onChange={e => setData('description', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800"></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* MEDIA & LOCATION */}
                            <div className={activeTab === 'media' ? 'block' : 'hidden'}>
                                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <ImageIcon className="w-5 h-5 text-amber-500" />
                                    <span>Media & Locations</span>
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">Main Image URL *</label>
                                        <input type="text" value={data.image} onChange={e => setData('image', e.target.value)} placeholder="https://..." className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                        {data.image && <img src={data.image} className="h-32 object-cover rounded-xl mt-2" alt="Preview" />}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500">YouTube Video URL</label>
                                        <input type="text" value={data.video_url} onChange={e => setData('video_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-800" />
                                    </div>

                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase text-slate-500">Gallery Images</label>
                                            <button type="button" onClick={() => addArrayItem('gallery')} className="text-xs bg-white dark:bg-slate-700 px-3 py-1 rounded border shadow-sm">Add Image</button>
                                        </div>
                                        {data.gallery.map((img, idx) => (
                                            <div key={idx} className="flex space-x-2">
                                                <input type="text" value={img} onChange={e => updateArrayItem('gallery', idx, e.target.value)} className="flex-grow px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-700" placeholder="Image URL" />
                                                <button type="button" onClick={() => removeArrayItem('gallery', idx)} className="px-3 text-red-500 font-bold hover:bg-red-50 rounded-lg">✕</button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Google Maps Configuration */}
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-700">
                                        <h3 className="font-bold flex items-center space-x-2">
                                            <MapPin className="w-4 h-4 text-amber-500" />
                                            <span>Map Waypoints & Center</span>
                                        </h3>
                                        <p className="text-xs text-slate-500">Add waypoints to draw the route map. Center is where the map starts.</p>
                                        
                                        <div className="grid grid-cols-2 gap-4 pb-4 border-b dark:border-slate-700">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-500">Center Lat</label>
                                                <input type="number" step="any" value={data.map_center_lat} onChange={e => setData('map_center_lat', e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-slate-950" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-slate-500">Center Lng</label>
                                                <input type="number" step="any" value={data.map_center_lng} onChange={e => setData('map_center_lng', e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-sm dark:bg-slate-950" />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {data.waypoints.map((wp, idx) => (
                                                <div key={idx} className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2 rounded-xl border dark:border-slate-700">
                                                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                                                    <input type="text" placeholder="Place Name" value={wp.name || ''} onChange={e => updateWaypoint(idx, 'name', e.target.value)} className="flex-1 px-2 py-1.5 text-sm rounded border dark:bg-slate-950" />
                                                    <input type="number" step="any" placeholder="Lat" value={wp.lat || ''} onChange={e => updateWaypoint(idx, 'lat', e.target.value)} className="w-24 px-2 py-1.5 text-sm rounded border dark:bg-slate-950" />
                                                    <input type="number" step="any" placeholder="Lng" value={wp.lng || ''} onChange={e => updateWaypoint(idx, 'lng', e.target.value)} className="w-24 px-2 py-1.5 text-sm rounded border dark:bg-slate-950" />
                                                    <button type="button" onClick={() => removeArrayItem('waypoints', idx)} className="text-red-500 px-2 font-bold hover:bg-red-50 rounded">✕</button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => addArrayItem('waypoints', {name: '', lat: 7.0, lng: 80.0})} className="text-xs bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg">
                                                + Add Waypoint
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* HIGHLIGHTS & ITINERARY */}
                            <div className={activeTab === 'content' ? 'block' : 'hidden'}>
                                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <List className="w-5 h-5 text-amber-500" />
                                    <span>Highlights & Itinerary</span>
                                </h2>

                                <div className="space-y-8">
                                    {/* Highlights */}
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-500">Key Highlights</label>
                                            <button type="button" onClick={() => addArrayItem('highlights')} className="text-xs bg-white dark:bg-slate-700 px-3 py-1 rounded border shadow-sm">Add Highlight</button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.highlights.map((item, idx) => (
                                                <div key={idx} className="flex space-x-2">
                                                    <input type="text" value={item} onChange={e => updateArrayItem('highlights', idx, e.target.value)} className="flex-grow px-4 py-2 border rounded-lg dark:bg-slate-950 dark:border-slate-700" placeholder="e.g. Visit the ancient rock fortress..." />
                                                    <button type="button" onClick={() => removeArrayItem('highlights', idx)} className="px-3 text-red-500 font-bold hover:bg-red-50 rounded-lg">✕</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Itinerary */}
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-xs font-bold uppercase text-slate-500">Daily Itinerary</label>
                                            <button type="button" onClick={() => addArrayItem('itinerary', { day: 'Day 1', title: '', desc: '' })} className="text-xs bg-white dark:bg-slate-700 px-3 py-1 rounded border shadow-sm">Add Day</button>
                                        </div>
                                        <div className="space-y-4">
                                            {data.itinerary.map((item, idx) => (
                                                <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border dark:border-slate-700 relative group">
                                                    <button type="button" onClick={() => removeArrayItem('itinerary', idx)} className="absolute top-2 right-2 p-2 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3 pr-8">
                                                        <input type="text" value={item.day || ''} onChange={e => updateItinerary(idx, 'day', e.target.value)} placeholder="Day 1" className="px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm font-bold" />
                                                        <input type="text" value={item.title || ''} onChange={e => updateItinerary(idx, 'title', e.target.value)} placeholder="Arrival & Transfer to Kandy" className="md:col-span-3 px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm font-bold" />
                                                    </div>
                                                    <textarea value={item.desc || ''} onChange={e => updateItinerary(idx, 'desc', e.target.value)} placeholder="Description of the day's activities..." rows="3" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-950 text-sm"></textarea>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SETTINGS & SEO */}
                            <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
                                <h2 className="text-xl font-bold mb-6 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                                    <Settings className="w-5 h-5 text-amber-500" />
                                    <span>Settings & SEO</span>
                                </h2>

                                <div className="space-y-8">
                                    {/* Tour Params */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Difficulty Level</label>
                                            <select value={data.difficulty} onChange={e => setData('difficulty', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950">
                                                <option value="easy">Easy (All Ages)</option>
                                                <option value="moderate">Moderate</option>
                                                <option value="challenging">Challenging</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Max Group Size</label>
                                            <input type="number" value={data.max_group_size} onChange={e => setData('max_group_size', parseInt(e.target.value))} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950" />
                                        </div>
                                    </div>

                                    {/* Search Tags */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase text-slate-500 flex items-center"><Tag className="w-3.5 h-3.5 mr-1" /> Search Tags (Press Enter)</label>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Safari, Couples, Honeymoon..." 
                                            className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950"
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const val = e.target.value.trim();
                                                    if (val && !data.tags.includes(val)) addArrayItem('tags', val);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {data.tags.map((tag, idx) => (
                                                <span key={idx} className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                                                    <span>{tag}</span>
                                                    <button type="button" onClick={() => removeArrayItem('tags', idx)} className="text-slate-400 hover:text-red-500">✕</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SEO */}
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                                        <h3 className="font-bold text-sm">SEO Meta Data</h3>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">Meta Title</label>
                                            <input type="text" value={data.seo_title} onChange={e => setData('seo_title', e.target.value)} placeholder="e.g. 5 Day Cultural Tour in Sri Lanka | Xplor Lanka" className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 text-sm" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500">Meta Description</label>
                                            <textarea rows="3" value={data.seo_description} onChange={e => setData('seo_description', e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-slate-950 text-sm"></textarea>
                                        </div>
                                    </div>

                                    {/* Toggles */}
                                    <div className="flex space-x-6 pt-4">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={data.is_featured} onChange={e => setData('is_featured', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                                            <span className="font-bold">Featured Tour</span>
                                        </label>
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
                                            <span className="font-bold">Active (Visible to public)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
