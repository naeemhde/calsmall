"use client";

import { useReducer, memo } from "react";
import {
  Plus,
  Minus,
  X,
  Divide,
  Percent,
  SquareRoot,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type State = {
  currentOperand: string;
  previousOperand: string | null;
  operation: string | null;
  memory: number;
  history: { expression: string; result: string }[];
  overwrite: boolean;
};

type Action =
  | { type: "ADD_DIGIT"; payload: string }
  | { type: "CHOOSE_OPERATION"; payload: string }
  | { type: "CLEAR" }
  | { type: "EVALUATE" }
  | { type: "SPECIAL_OPERATION"; payload: string }
  | { type: "MEMORY_OPERATION"; payload: string };

const initialState: State = {
  currentOperand: "0",
  previousOperand: null,
  operation: null,
  memory: 0,
  history: [],
  overwrite: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_DIGIT":
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload,
          overwrite: false,
        };
      }
      if (action.payload === "0" && state.currentOperand === "0") return state;
      if (action.payload === "." && state.currentOperand.includes("."))
        return state;
      if (state.currentOperand.length >= 15) return state; // Limit input length

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload}`,
      };

    case "CHOOSE_OPERATION":
      if (state.currentOperand === "" && state.previousOperand === null) {
        return state;
      }

      if (state.previousOperand === null) {
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      
      if (state.currentOperand === "") {
        return { ...state, operation: action.payload };
      }

      const evalResult = evaluate(state);
      return {
        ...state,
        operation: action.payload,
        previousOperand: evalResult.currentOperand,
        currentOperand: "",
        history: [...state.history, ...evalResult.history],
      };

    case "CLEAR":
      return { ...initialState, history: state.history, memory: state.memory };

    case "EVALUATE":
      if (
        state.operation === null ||
        state.previousOperand === null ||
        state.currentOperand === ""
      ) {
        return state;
      }
      return evaluate(state);

    case "SPECIAL_OPERATION":
      const { payload: specialOp } = action;
      const current = parseFloat(state.currentOperand);
      if (isNaN(current)) return state;

      let newCurrent = state.currentOperand;
      switch (specialOp) {
        case "√":
          if (current < 0) return { ...state, currentOperand: "Error" };
          newCurrent = String(Math.sqrt(current));
          break;
        case "%":
          newCurrent = String(current / 100);
          break;
      }
      return {
        ...state,
        currentOperand: formatNumber(newCurrent),
        overwrite: true,
      };

    case "MEMORY_OPERATION":
      const { payload: memOp } = action;
      const currentVal = parseFloat(state.currentOperand);

      switch (memOp) {
        case "MC":
          return { ...state, memory: 0 };
        case "MR":
          return {
            ...state,
            currentOperand: String(state.memory),
            overwrite: true,
          };
        case "M+":
          return { ...state, memory: state.memory + (isNaN(currentVal) ? 0 : currentVal) };
        case "M-":
          return { ...state, memory: state.memory - (isNaN(currentVal) ? 0 : currentVal) };
      }
      return state;

    default:
      return state;
  }
}

function formatNumber(numStr: string) {
    const num = parseFloat(numStr);
    if (isNaN(num)) return "Error";
    if (numStr.includes('.') && !numStr.endsWith('.')) {
        const decimalPlaces = numStr.split('.')[1].length;
        if (decimalPlaces > 8) return num.toPrecision(10);
    }
    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
        return num.toExponential(6);
    }
    return String(Number(num.toPrecision(15)));
}


function evaluate(state: State): State {
    const prev = parseFloat(state.previousOperand!);
    const current = parseFloat(state.currentOperand);

    if (isNaN(prev) || isNaN(current)) {
      return {...state, currentOperand: "Error", previousOperand: null, operation: null, overwrite: true};
    }

    let computation = 0;
    switch (state.operation) {
        case "+": computation = prev + current; break;
        case "-": computation = prev - current; break;
        case "×": computation = prev * current; break;
        case "÷":
            if (current === 0) {
                return {...state, currentOperand: "Error", previousOperand: null, operation: null, overwrite: true};
            }
            computation = prev / current;
            break;
        case "^": computation = Math.pow(prev, current); break;
    }
    
    const result = formatNumber(String(computation));
    const expression = `${state.previousOperand} ${state.operation} ${state.currentOperand}`;

    return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: result,
        operation: null,
        history: [...state.history, { expression, result }]
    };
}


const CalculatorButton = memo(({
  value,
  onClick,
  className,
  variant = "secondary",
  ariaLabel,
}: {
  value: React.ReactNode;
  onClick: () => void;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "accent";
  ariaLabel?: string;
}) => (
  <Button
    variant={variant as any}
    className={cn(
      "h-16 text-2xl font-semibold rounded-xl shadow-md active:shadow-inner active:scale-95 transition-all duration-100",
      className
    )}
    onClick={onClick}
    aria-label={ariaLabel || (typeof value === 'string' ? value : '')}
  >
    {value}
  </Button>
));
CalculatorButton.displayName = 'CalculatorButton';


export default function CalcuNext() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();

  const handleMemoryClick = (op: string) => {
    dispatch({ type: "MEMORY_OPERATION", payload: op });
    if (op === "MC" || op === "M+" || op === "M-") {
        toast({
            title: `Memory ${op === 'MC' ? 'Cleared' : op === 'M+' ? 'Add' : 'Subtract'}`,
            description: op !== 'MC' ? `New memory value: ${state.memory + (op === 'M+' ? parseFloat(state.currentOperand) : -parseFloat(state.currentOperand))}` : `Memory is now 0`,
        })
    }
  };

  const buttonGrid = [
    { value: "MC", type: "MEMORY", op: "MC", variant: "default" },
    { value: "MR", type: "MEMORY", op: "MR", variant: "default" },
    { value: "M+", type: "MEMORY", op: "M+", variant: "default" },
    { value: "M-", type: "MEMORY", op: "M-", variant: "default" },

    { value: "√", type: "SPECIAL", op: "√", variant: "primary" },
    { value: "^", type: "OPERATION", op: "^", variant: "primary" },
    { value: <Percent />, type: "SPECIAL", op: "%", variant: "primary" },
    { value: "AC", type: "CLEAR", op: "AC", variant: "destructive" },
    
    { value: "7", type: "DIGIT", op: "7" },
    { value: "8", type: "DIGIT", op: "8" },
    { value: "9", type: "DIGIT", op: "9" },
    { value: <Divide />, type: "OPERATION", op: "÷", variant: "primary" },

    { value: "4", type: "DIGIT", op: "4" },
    { value: "5", type: "DIGIT", op: "5" },
    { value: "6", type: "DIGIT", op: "6" },
    { value: <X />, type: "OPERATION", op: "×", variant: "primary" },

    { value: "1", type: "DIGIT", op: "1" },
    { value: "2", type: "DIGIT", op: "2" },
    { value: "3", type: "DIGIT", op: "3" },
    { value: <Minus />, type: "OPERATION", op: "-", variant: "primary" },

    { value: "0", type: "DIGIT", op: "0" },
    { value: ".", type: "DIGIT", op: "." },
    { value: "=", type: "EVALUATE", op: "=", variant: "accent" },
    { value: <Plus />, type: "OPERATION", op: "+", variant: "primary" },
  ];
  
  const displayValue = state.currentOperand === "Error" ? "Error" : (state.currentOperand || "0");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      <Card className="lg:col-span-2 shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
        <CardContent className="p-4 md:p-6">
          <div className="bg-muted/50 rounded-lg p-4 text-right break-words mb-4 min-h-[120px] flex flex-col justify-between">
            <div className="text-muted-foreground text-2xl h-8 overflow-hidden">
              {state.previousOperand} {state.operation}
            </div>
            <div
              className="text-foreground font-bold text-5xl md:text-6xl h-14"
              role="region"
              aria-live="polite"
            >
              {displayValue}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 md:gap-4">
            {buttonGrid.map((btn, index) => (
              <CalculatorButton
                key={index}
                value={btn.value}
                variant={btn.variant as any}
                onClick={() => {
                  if (btn.type === "DIGIT")
                    dispatch({ type: "ADD_DIGIT", payload: btn.op });
                  else if (btn.type === "OPERATION")
                    dispatch({ type: "CHOOSE_OPERATION", payload: btn.op });
                  else if (btn.type === "CLEAR") dispatch({ type: "CLEAR" });
                  else if (btn.type === "EVALUATE")
                    dispatch({ type: "EVALUATE" });
                  else if (btn.type === "SPECIAL")
                    dispatch({ type: "SPECIAL_OPERATION", payload: btn.op });
                   else if (btn.type === "MEMORY")
                    handleMemoryClick(btn.op);
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-2xl bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle>History</CardTitle>
          <CardDescription>Your recent calculations.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[480px] pr-4">
            {state.history.length === 0 ? (
              <p className="text-muted-foreground text-center">No calculations yet.</p>
            ) : (
              <div className="space-y-4">
                {state.history.slice().reverse().map((item, index) => (
                  <div key={index} className="text-sm">
                    <p className="text-muted-foreground truncate">{item.expression}</p>
                    <p className="font-semibold text-lg text-foreground">= {item.result}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
