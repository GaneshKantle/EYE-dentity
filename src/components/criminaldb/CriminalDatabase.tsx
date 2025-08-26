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
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">Criminal Database</h1>
              <p className="text-gray-600">Manage and store criminal records and information</p>
            </div>
          </div>
        </div>

        {/* Search and Add Section */}
        <Card className="mb-6 bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Search by name or crime..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-amber-200 text-gray-800 focus:border-red-300"
                />
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white">
                    <Plus className="w-4 h-4" />
                    Add Criminal Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white border-amber-200">
                  <DialogHeader>
                    <DialogTitle className="text-gray-800">Add New Criminal Record</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-gray-700">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                          className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-gray-700">Gender</Label>
                        <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                          <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300">
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
                      <Label htmlFor="crime" className="text-gray-700">Crime</Label>
                      <Input
                        id="crime"
                        value={formData.crime}
                        onChange={(e) => setFormData(prev => ({ ...prev, crime: e.target.value }))}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-gray-700">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-gray-700">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-amber-200">
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="wanted">Wanted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600">
                        Cancel
                      </Button>
                      <Button onClick={handleAddCriminal} className="bg-red-500 hover:bg-red-600 text-white">
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
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-800">Criminal Records ({filteredCriminals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-amber-200 hover:bg-amber-50">
                  <TableHead className="text-gray-700">Name</TableHead>
                  <TableHead className="text-gray-700">Age</TableHead>
                  <TableHead className="text-gray-700">Gender</TableHead>
                  <TableHead className="text-gray-700">Crime</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-gray-700">Date Added</TableHead>
                  <TableHead className="text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCriminals.map((criminal) => (
                  <TableRow key={criminal.id} className="border-amber-200 hover:bg-amber-50">
                    <TableCell className="font-medium text-gray-800">{criminal.name}</TableCell>
                    <TableCell className="text-gray-700">{criminal.age}</TableCell>
                    <TableCell className="text-gray-700">{criminal.gender}</TableCell>
                    <TableCell className="text-gray-700">{criminal.crime}</TableCell>
                    <TableCell>{getStatusBadge(criminal.status)}</TableCell>
                    <TableCell className="text-gray-700">{criminal.dateAdded}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(criminal)}
                          className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCriminal(criminal.id)}
                          className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md bg-white border-amber-200">
            <DialogHeader>
              <DialogTitle className="text-gray-800">Edit Criminal Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-gray-700">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-age" className="text-gray-700">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-gender" className="text-gray-700">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300">
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
                <Label htmlFor="edit-crime" className="text-gray-700">Crime</Label>
                <Input
                  id="edit-crime"
                  value={formData.crime}
                  onChange={(e) => setFormData(prev => ({ ...prev, crime: e.target.value }))}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                />
              </div>
              <div>
                <Label htmlFor="edit-description" className="text-gray-700">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="bg-white border-amber-200 text-gray-800 focus:border-red-300"
                />
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-gray-700">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-white border-amber-200 text-gray-800 focus:border-red-300">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-amber-200">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="wanted">Wanted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-amber-200 text-gray-700 hover:border-red-300 hover:text-red-600">
                  Cancel
                </Button>
                <Button onClick={handleEditCriminal} className="bg-red-500 hover:bg-red-600 text-white">
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
