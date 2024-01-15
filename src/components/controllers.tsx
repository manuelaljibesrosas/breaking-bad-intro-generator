import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import OptionsOutline from "@/assets/icons/options-outline.svg?react";

const lettersRegex = /^[a-zA-Z]+$/;

const schema = z.object({
  firstWord: z.string().refine((data) => lettersRegex.test(data), {
    message:
      "First word must contain only letters without spaces or new lines.",
  }),
  secondWord: z.string().refine((data) => lettersRegex.test(data), {
    message:
      "Second word must contain only letters without spaces or new lines.",
  }),
});

export type FormInputs = z.infer<typeof schema>;

function Controllers({ onSubmit }: { onSubmit: SubmitHandler<FormInputs> }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<FormInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues: {
      firstWord: "Breaking",
      secondWord: "Bad",
    },
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="cursor-pointer absolute top-5 right-6 w-11 h-11 rounded-full bg-green-700">
          <OptionsOutline className="-translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 w-6 h-6" />
        </div>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[350px] p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Breaking Bad Intro</CardTitle>
              <CardDescription>
                A web experiment by Manuel Aljibes Rosas{" "}
                <a
                  href="https://github.com/manuelaljibesrosas/breaking-bad-intro"
                  className="underline"
                >
                  https://github.com/manuelaljibesrosas/breaking-bad-intro
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="firstWord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First word</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="secondWord"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second word</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                onClick={() => setIsOpen(false)}
              >
                Cook
              </Button>
            </CardFooter>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}

export default Controllers;
