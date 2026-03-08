import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Card className="custom" data-testid="card">C</Card>);
    expect(screen.getByTestId("card")).toHaveClass("custom");
  });

  it("has correct displayName", () => {
    expect(Card.displayName).toBe("Card");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(CardHeader.displayName).toBe("CardHeader");
  });
});

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Title</CardTitle>);
    const el = screen.getByText("Title");
    expect(el.tagName).toBe("H3");
  });

  it("has correct displayName", () => {
    expect(CardTitle.displayName).toBe("CardTitle");
  });
});

describe("CardDescription", () => {
  it("renders as p", () => {
    render(<CardDescription>Desc</CardDescription>);
    const el = screen.getByText("Desc");
    expect(el.tagName).toBe("P");
  });

  it("has correct displayName", () => {
    expect(CardDescription.displayName).toBe("CardDescription");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(CardContent.displayName).toBe("CardContent");
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("has correct displayName", () => {
    expect(CardFooter.displayName).toBe("CardFooter");
  });
});

describe("Card composition", () => {
  it("renders a full card with all subcomponents", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>My Title</CardTitle>
          <CardDescription>My Desc</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>
    );
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Desc")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Foot")).toBeInTheDocument();
  });
});
