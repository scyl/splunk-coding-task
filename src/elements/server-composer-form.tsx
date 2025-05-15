import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Checkbox } from "@/components/ui/checkbox";

export enum CPU {
  X86 = "x86",
  POWER = "power",
  ARM = "arm",
}

export type ServerConfig = {
 cpu: CPU,
 memorySize: number,
 gpu: boolean,
}

const formSchema = z.object({
  cpu: z.nativeEnum(CPU),
  memorySize: z.string().refine((value) => {
    if (!/^\d{1,3}(,\d{3})*$/.test(value)) {
      return false;
    }
    return true;
  }, "Comma separated integer number only"),
  gpu: z.boolean(),
});

export function ServerComposerForm({onValidSubmit}: {onValidSubmit: (value: ServerConfig) => void}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpu: undefined,
      memorySize: "",
      gpu: false,
    },
  });
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    onValidSubmit({...values, memorySize: parseInt(values.memorySize.replaceAll(",", ""), 10)});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="flex flex-col">
          <div className="flex justify-evenly md:h-[100px] flex-col md:flex-row items-center md:items-start">
            <FormField
              control={form.control}
              name="cpu"
              render={({ field }) => (
                <FormItem className="flex flex-col min-w-[240px]">
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
                  <FormMessage className="text-xs" />
                </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="memorySize"
              render={({field}) => (
                <FormItem className="flex flex-col min-w-[240px]">
                  <FormLabel>Memory Size</FormLabel>
                  <FormControl>
                    <InputWithSuffix placeholder="4,096" suffix="MB" maxLength={9} className="w-[180px]" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
                )} 
              />
            <FormField
              control={form.control}
              name="gpu"
              render={({ field }) => (
                <FormItem className="min-w-[240px]">
                  <div className="mt-[22px] flex items-center h-[36px]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                    <FormLabel className="ml-2">
                      GPU Accelerator Card
                    </FormLabel>
                  </div>
                </FormItem>
                )}
              />
          </div>
          <div><Button type="submit">Submit</Button></div>
        </div>
      </form>
    </Form>
  );
}