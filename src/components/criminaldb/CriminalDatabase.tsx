import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, Eye, Database } from 'lucide-react';

interface CriminalRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  crime: string;
  description: string;
  image?: string;
  dateAdded: string;
  status: 'active' | 'inactive' | 'wanted';
}

const CriminalDatabase: React.FC = () => {
  const [criminals, setCriminals] = useState<CriminalRecord[]>([
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      crime: 'Armed Robbery',
      description: 'Suspect involved in multiple armed robberies in downtown area.',
      dateAdded: '2024-01-15',
      status: 'wanted'
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      crime: 'Fraud',
      description: 'Identity theft and credit card fraud across multiple states.',
      dateAdded: '2024-01-10',
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCriminal, setSelectedCriminal] = useState<CriminalRecord | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    crime: '',
    description: '',
    status: 'active'
  });

  const filteredCriminals = criminals.filter(criminal =>
    criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criminal.crime.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCriminal = () => {
    const newCriminal: CriminalRecord = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      crime: formData.crime,
      description: formData.description,
      dateAdded: new Date().toISOString().split('T')[0],
      status: formData.status as 'active' | 'inactive' | 'wanted'
    };

    setCriminals(prev => [...prev, newCriminal]);
    setFormData({
      name: '',
      age: '',
      gender: '',
      crime: '',
      description: '',
      status: 'active'
    });
    setIsAddDialogOpen(false);
  };

  const handleEditCriminal = () => {
    if (!selectedCriminal) return;

    const updatedCriminals = criminals.map(criminal =>
      criminal.id === selectedCriminal.id
        ? {
            ...criminal,
            name: formData.name,
            age: parseInt(formData.age),
            gender: formData.gender,
            crime: formData.crime,
            description: formData.description,
            status: formData.status as 'active' | 'inactive' | 'wanted'
          }
        : criminal
    );

    setCriminals(updatedCriminals);
    setFormData({
      name: '',
      age: '',
      gender: '',
      crime: '',
      description: '',
      status: 'active'
    });
    setSelectedCriminal(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteCriminal = (id: string) => {
    setCriminals(prev => prev.filter(criminal => criminal.id !== id));
  };

  const openEditDialog = (criminal: CriminalRecord) => {
    setSelectedCriminal(criminal);
    setFormData({
      name: criminal.name,
      age: criminal.age.toString(),
      gender: criminal.gender,
      crime: criminal.crime,
      description: criminal.description,
      status: criminal.status
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      wanted: 'bg-red-100 text-red-800 border-red-200'
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-800">
      <div className="container mx-auto p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
          <div className="flex flex-col xs:flex-row sm:flex-row items-start xs:items-center sm:items-center space-y-3 xs:space-y-0 sm:space-y-0 xs:space-x-3 sm:space-x-3 mb-3 xs:mb-4 sm:mb-4">
            <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-lg xs:rounded-xl sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Database className="w-5 h-5 xs:w-6 xs:h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-1 xs:mb-1 sm:mb-1">Criminal Database</h1>
              <p className="text-sm xs:text-base sm:text-base md:text-lg text-gray-600">Manage and store criminal records and information</p>
            </div>
          </div>
        </div>

        {/* Search and Add Section */}
        <Card className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4 xs:p-5 sm:p-6 md:p-8">
            <div className="flex flex-col xs:flex-col sm:flex-row gap-3 xs:gap-4 sm:gap-4 items-stretch xs:items-center sm:items-center justify-between">
              <div className="relative flex-1 max-w-full xs:max-w-md sm:max-w-md">
                <Search className="absolute left-2.5 xs:left-3 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                <Input
                  placeholder="Search by name or crime..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 xs:pl-10 sm:pl-10 bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1.5 xs:gap-2 sm:gap-2 bg-red-500 hover:bg-red-600 text-white h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base px-3 xs:px-4 sm:px-4 transition-all duration-300">
                    <Plus className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline sm:inline">Add Criminal Record</span>
                    <span className="xs:hidden sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg bg-white border-amber-200 mx-4 xs:mx-6 sm:mx-8">
                  <DialogHeader className="pb-3 xs:pb-4 sm:pb-4">
                    <DialogTitle className="text-gray-800 text-base xs:text-lg sm:text-lg md:text-xl">Add New Criminal Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 xs:space-y-4 sm:space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 text-sm xs:text-base sm:text-base">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-4">
                      <div>
                        <Label htmlFor="age" className="text-gray-700 text-sm xs:text-base sm:text-base">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-gray-700 text-sm xs:text-base sm:text-base">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                          <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-amber-200">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="crime" className="text-gray-700 text-sm xs:text-base sm:text-base">Crime</Label>
                      <Input
                        id="crime"
                        value={formData.crime}
                        onChange={(e) => setFormData(prev => ({ ...prev, crime: e.target.value }))}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-gray-700 text-sm xs:text-base sm:text-base">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300 text-sm xs:text-base sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-gray-700 text-sm xs:text-base sm:text-base">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-amber-200">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="wanted">Wanted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col xs:flex-row sm:flex-row gap-2 xs:gap-2 sm:gap-2 justify-end pt-2 xs:pt-3 sm:pt-3">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base transition-all duration-300">
                        Cancel
                      </Button>
                      <Button onClick={handleAddCriminal} className="bg-red-500 hover:bg-red-600 text-white h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base transition-all duration-300">
                        Add Record
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Criminal Records Table */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader className="p-4 xs:p-5 sm:p-6 md:p-8">
            <CardTitle className="text-gray-800 text-base xs:text-lg sm:text-lg md:text-xl">Criminal Records ({filteredCriminals.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 xs:p-0 sm:p-0 md:p-0 lg:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-amber-200 hover:bg-amber-50">
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">Name</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">Age</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">Gender</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">Crime</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">Status</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">Date Added</TableHead>
                    <TableHead className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCriminals.map((criminal) => (
                    <TableRow key={criminal.id} className="border-amber-200 hover:bg-amber-50">
                      <TableCell className="font-medium text-gray-800 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">
                        <div className="flex flex-col">
                          <span className="font-semibold">{criminal.name}</span>
                          <span className="text-xs text-gray-500 xs:hidden sm:hidden">Age: {criminal.age} • {criminal.gender}</span>
                          <span className="text-xs text-gray-500 xs:hidden sm:hidden">Added: {criminal.dateAdded}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">{criminal.age}</TableCell>
                      <TableCell className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">{criminal.gender}</TableCell>
                      <TableCell className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">{criminal.crime}</TableCell>
                      <TableCell className="px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">{getStatusBadge(criminal.status)}</TableCell>
                      <TableCell className="text-gray-700 text-xs xs:text-sm sm:text-sm md:text-base px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3 hidden xs:table-cell sm:table-cell">{criminal.dateAdded}</TableCell>
                      <TableCell className="px-2 xs:px-3 sm:px-4 py-2 xs:py-3 sm:py-3">
                        <div className="flex gap-1 xs:gap-2 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(criminal)}
                            className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 h-7 w-7 xs:h-8 xs:w-8 sm:h-8 sm:w-8 p-0 transition-all duration-300"
                          >
                            <Edit className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCriminal(criminal.id)}
                            className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 h-7 w-7 xs:h-8 xs:w-8 sm:h-8 sm:w-8 p-0 transition-all duration-300"
                          >
                            <Trash2 className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg bg-white border-amber-200 mx-4 xs:mx-6 sm:mx-8">
            <DialogHeader className="pb-3 xs:pb-4 sm:pb-4">
              <DialogTitle className="text-gray-800 text-base xs:text-lg sm:text-lg md:text-xl">Edit Criminal Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 xs:space-y-4 sm:space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-700 text-sm xs:text-base sm:text-base">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-4">
                <div>
                  <Label htmlFor="edit-age" className="text-gray-700 text-sm xs:text-base sm:text-base">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender" className="text-gray-700 text-sm xs:text-base sm:text-base">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-amber-200">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-crime" className="text-gray-700 text-sm xs:text-base sm:text-base">Crime</Label>
                <Input
                  id="edit-crime"
                  value={formData.crime}
                  onChange={(e) => setFormData(prev => ({ ...prev, crime: e.target.value }))}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-gray-700 text-sm xs:text-base sm:text-base">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300 text-sm xs:text-base sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-gray-700 text-sm xs:text-base sm:text-base">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-200">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="wanted">Wanted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col xs:flex-row sm:flex-row gap-2 xs:gap-2 sm:gap-2 justify-end pt-2 xs:pt-3 sm:pt-3">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600 h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base transition-all duration-300">
                  Cancel
                </Button>
                <Button onClick={handleEditCriminal} className="bg-red-500 hover:bg-red-600 text-white h-9 xs:h-10 sm:h-10 text-sm xs:text-base sm:text-base transition-all duration-300">
                  Update Record
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CriminalDatabase;
