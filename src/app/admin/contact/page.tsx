import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {  Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

const ContactPage: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Mike Hugo Jones',
      email: 'mike@monkeydigital.co',
      message: `Hi there , I wanted to check in with something that could seriously
                help your website's visitor count . We work with a trusted ad network
                that allows us to deliver authentic , geo - targeted social ads traffic for
                just $ 10 per 10,000 visits . This isn't fake traffic - it's engaged traffic ,
                tailored to your chosen market and niche . What you get : 10,000+
                real visitors for just $ 10 Localized traffic for any country Scalability
                available based on your needs Used by marketers - we even use this
                for our SEO clients ! Interested ? Check out the details here :
                https://www.monkeydigital.co/product/country-targeted-traffic/ Or
                connect instantly on WhatsApp :
                https://monkeydigital.co/whatsapp-us/ Let's get started today ! Best ,
                Mike Hugo Jones Phone / whatsapp : +1 ( 775 ) 314-7914`,
      date: '10 Mar 2025 07:05 PM',
    },
    {
      id: 2,
      name: 'Oliviatring',
      email: 'ebojajuje04@gmail.com',
      message: 'Salut , ech wollt Are Präis wëssen .',
      date: '03 Mar 2025 12:55 AM',
    },
    {
      id: 3,
      name: 'Jo Riggs',
      email: 'joannariggs01@gmail.com',
      message: `Hi , I just visited livedoctors.in and wondered if you'd ever thought
                about having an engaging video to explain what you do ? Our prices
                start from just $ 195 USD . We have produced over 500 videos to date
                and work with both non - animated and animated formats : Non-
                animated example : https://www.youtube.com/watch ?
                v = bA2DyChM40c Animated example :
                https://www.youtube.com/watch?v=JG33 MgGjfc Let me know if`,
      date: '28 Feb 2025 06:12 PM',
    },
  ]);



  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Contact</h2>

      <div className="rounded-md overflow-hidden border border-gray-200">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[80px] text-gray-700">#</TableHead>
              <TableHead className="text-gray-700">Name</TableHead>
              <TableHead className="text-gray-700">Email</TableHead>
              <TableHead className="text-gray-700">Message</TableHead>
              <TableHead className="text-gray-700">Date</TableHead>
              <TableHead className="text-right text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} className="hover:bg-gray-100/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{contact.id}</TableCell>
                <TableCell className="text-gray-900">{contact.name}</TableCell>
                <TableCell className="text-gray-900">{contact.email}</TableCell>
                <TableCell className="text-gray-900 whitespace-pre-wrap">{contact.message}</TableCell>
                <TableCell className="text-gray-900">{contact.date}</TableCell>
                <TableCell className="text-right space-x-2">

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white text-gray-900 border-gray-200">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-gray-900">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-700">
                          This action cannot be undone. This will permanently delete this message from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md transition-colors duration-200">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteContact(contact.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContactPage;
