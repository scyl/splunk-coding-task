import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputWithSuffix } from "@/components/ui/input-with-suffix";

const formSchema = z.object({
  cpu: z.enum(["x86", "power", "arm"]),
  memorySize: z.string().refine((value) => {
    if (!/^\d{1,3}(,\d{3})*$/.test(value)) {
      return false;
    }
    return true;
  }, "Comma separated integer number only"),
  gpu: z.boolean(),
});

export function ServerComposerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpu: undefined,
      memorySize: "",
      gpu: false
    },
  });
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col">
          <div className="flex justify-evenly">
            <div>
              <FormField
                control={form.control}
                name="cpu"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPU</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="x86">X86</SelectItem>
                        <SelectItem value="power">Power</SelectItem>
                        <SelectItem value="arm">ARM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="memorySize"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Memory Size</FormLabel>
                    <FormControl>
                      <InputWithSuffix placeholder="shadcn" suffix="MB" maxLength={9} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
            </div>
            <div>

            </div>
          </div>
          <div><Button type="submit">Submit</Button></div>
        </div>
      </form>
    </Form>
  );
}