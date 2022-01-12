import React from "react"
import {
  render,
  screen,
  act,
  getByText,
  getAllByRole,
  getByRole,
} from "@testing-library/react"
import PlanPanel from "./PlanPanel"
import userEvent from "@testing-library/user-event"

describe("The plan panel", () => {
  it("renders without errors when supplied the appropriate props", () => {
    render(
      <PlanPanel
        exclusions={[]}
        plannerConfig={{
          defaultDeliveryDays: ["Monday", "Thursday"],
          extrasLabels: ["Breakfast", "Large Snack"],
          planLabels: ["EQ", "Mass", "Micro"],
        }}
      />
    )
  })

  const getRowCells = (rowHeader: string) =>
    getAllByRole(
      screen.getByRole("row", {name: (name) => name.startsWith(rowHeader)}),
      "cell"
    )

  const clickCheckBox = (label: string) =>
    act(() => {
      const checkbox = screen.getByLabelText(label)
      userEvent.click(checkbox)
    })

  const clickDropItem = (item: string) =>
    act(() => userEvent.click(getByText(screen.getByRole("menubar"), item)))

  const clickButtonWithName = (name: string) =>
    act(() => userEvent.click(screen.getByRole("button", {name})))

  const changeSelectBox = (testId: string, newValue: string) => {
    const box = screen.getByTestId(testId)
    act(() => {
      userEvent.click(box)
    })
    clickDropItem(newValue)
  }

  describe("customer plan section", () => {
    it("Changes the delivery day in the meal deliveries table if you change the delivery day", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Snack", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("delivery-0-select", "Wednesday")
      changeSelectBox("delivery-1-select", "Friday")

      const wednesdayHeader = screen.queryByRole("columnheader", {
        name: "Wednesday",
      })
      expect(wednesdayHeader).toBeInTheDocument()

      const fridayHeader = screen.queryByRole("columnheader", {
        name: "Friday",
      })
      expect(fridayHeader).toBeInTheDocument()
    })

    it("Displays a message highlighting that a customer is on a custom plan when something is changed in the meal deliveries section", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Snack", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("planVariant", "Micro")

      const cells = getRowCells("Micro")

      act(() => {
        userEvent.click(getByRole(cells[0], "button"))
      })

      clickDropItem("3")

      const summary = screen.getByTestId("summary")
      expect(summary).toHaveTextContent(
        "This customer is on a custom plan. Click the above button to reset the plan to the default distribution."
      )
    })

    it("Does not display the custom plan message before changes are made in the meal deliveries table", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Snack", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("planVariant", "Micro")

      const summary = screen.queryByTestId("summary")
      expect(summary).not.toBeInTheDocument()
    })

    it("displays the correct total at the end of a meal deliveries row when the amounts were filled in by a preset plan", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Wednesday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("mealsPerDay", "4")
      changeSelectBox("totalPlans", "2")
      changeSelectBox("planVariant", "Micro")

      const cells = getRowCells("Micro")
      expect(cells[3]).toHaveTextContent("40")
    })

    it("zeros the other rows when you change the plan to a different variant", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "2")
      changeSelectBox("mealsPerDay", "4")
      changeSelectBox("totalPlans", "1")
      changeSelectBox("planVariant", "Micro")

      const cells = getRowCells("EQ")

      expect(getByRole(cells[0], "textbox")).toHaveDisplayValue(String("0"))
      expect(getByRole(cells[1], "textbox")).toHaveDisplayValue(String("0"))
    })

    it("adds some extras to the distribution when the relavent extras checkbox is selected", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Wednesday", "Thursday"],
            extrasLabels: ["Breakfast", "Snack", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      clickCheckBox("Breakfast")
      clickCheckBox("Large Snack")

      const breakfast = getRowCells("Breakfast")
      changeSelectBox("daysPerWeek", "5")
      expect(getByRole(breakfast[0], "textbox")).toHaveDisplayValue("2")
      expect(getByRole(breakfast[1], "textbox")).toHaveDisplayValue("2")
      expect(getByRole(breakfast[2], "textbox")).toHaveDisplayValue("1")

      const largeSnack = getRowCells("Large Snack")
      changeSelectBox("daysPerWeek", "5")
      expect(getByRole(largeSnack[0], "textbox")).toHaveDisplayValue("2")
      expect(getByRole(largeSnack[1], "textbox")).toHaveDisplayValue("2")
      expect(getByRole(largeSnack[2], "textbox")).toHaveDisplayValue("1")

      const snack = getRowCells("Snack")
      changeSelectBox("daysPerWeek", "5")
      expect(getByRole(snack[0], "textbox")).toHaveDisplayValue("0")
      expect(getByRole(snack[1], "textbox")).toHaveDisplayValue("0")
    })

    it.each`
      daysPerWeek | mealsPerDay | totalPlans | variant   | delivery1 | delivery2 | delivery3
      ${1}        | ${1}        | ${1}       | ${"EQ"}   | ${1}      | ${0}      | ${0}
      ${6}        | ${2}        | ${1}       | ${"EQ"}   | ${4}      | ${4}      | ${4}
      ${6}        | ${2}        | ${3}       | ${"EQ"}   | ${12}     | ${12}     | ${12}
      ${1}        | ${1}        | ${1}       | ${"Mass"} | ${1}      | ${0}      | ${0}
      ${6}        | ${2}        | ${1}       | ${"Mass"} | ${4}      | ${4}      | ${4}
      ${5}        | ${2}        | ${1}       | ${"Mass"} | ${4}      | ${4}      | ${2}
      ${7}        | ${1}        | ${1}       | ${"Mass"} | ${2}      | ${2}      | ${3}
      ${7}        | ${2}        | ${1}       | ${"Mass"} | ${4}      | ${4}      | ${6}
      ${7}        | ${2}        | ${2}       | ${"Mass"} | ${8}      | ${8}      | ${12}
    `(
      `displays $delivery1 and $delivery2 in the $variant row when you change the plan selection to $totalPlans $variant, $mealsPerDay meals per day, $daysPerWeek days per week`,
      ({
        daysPerWeek,
        mealsPerDay,
        totalPlans,
        variant,
        delivery1,
        delivery2,
        delivery3,
      }) => {
        render(
          <PlanPanel
            exclusions={[]}
            plannerConfig={{
              defaultDeliveryDays: ["Monday", "Wednesday", "Thursday"],
              extrasLabels: ["Breakfast", "Large Snack"],
              planLabels: ["EQ", "Mass"],
            }}
          />
        )

        changeSelectBox("daysPerWeek", daysPerWeek)
        changeSelectBox("mealsPerDay", mealsPerDay)
        changeSelectBox("totalPlans", totalPlans)
        changeSelectBox("planVariant", variant)

        const cells = getRowCells(variant)

        expect(getByRole(cells[0], "textbox")).toHaveDisplayValue(
          String(delivery1)
        )
        expect(getByRole(cells[1], "textbox")).toHaveDisplayValue(
          String(delivery2)
        )
        expect(getByRole(cells[2], "textbox")).toHaveDisplayValue(
          String(delivery3)
        )
      }
    )

    it("does not change snacks based on meals per day", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Snack", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      clickCheckBox("Breakfast")

      const cells = getRowCells("Breakfast")

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("mealsPerDay", "3")

      expect(getByRole(cells[0], "textbox")).toHaveDisplayValue("2")
      expect(getByRole(cells[1], "textbox")).toHaveDisplayValue("2")
    })

    it("defaults to 6 days per week, 2 meals per day and the first item in the variant list", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass"],
          }}
        />
      )

      const daysPerWeek = screen.getByTestId("daysPerWeek")
      expect(daysPerWeek).toHaveDisplayValue("6")

      const mealsPerDay = screen.getByTestId("mealsPerDay")
      expect(mealsPerDay).toHaveDisplayValue("2")

      const planName = screen.getByTestId("planVariant")
      expect(planName).toHaveDisplayValue("EQ")
    })
  })

  describe("clear custom plan button", () => {
    it("is now shown by default", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      const clearButton = screen.queryByRole("button", {
        name: "Clear Custom Plan",
      })
      expect(clearButton).not.toBeInTheDocument()
    })

    it("is not shown when you make changes to the customer plan", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "1")
      changeSelectBox("mealsPerDay", "3")

      const clearButton = screen.queryByRole("button", {
        name: "Clear Custom Plan",
      })
      expect(clearButton).not.toBeInTheDocument()
    })

    it("is shown if you make a change in the deliveries box", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "6")
      changeSelectBox("mealsPerDay", "2")

      const cells = getRowCells("Micro")

      act(() => {
        userEvent.click(getByRole(cells[0], "button"))
      })

      clickDropItem("2")

      const clearButton = screen.queryByRole("button", {
        name: "Clear Custom Plan",
      })
      expect(clearButton).toBeInTheDocument()
    })

    it("is not shown when you make changes to the customer plan", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "1")
      changeSelectBox("mealsPerDay", "3")

      const clearButton = screen.queryByRole("button", {
        name: "Clear Custom Plan",
      })
      expect(clearButton).not.toBeInTheDocument()
    })

    it("removes the custom plan message when you click on it", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "6")
      changeSelectBox("mealsPerDay", "2")
      changeSelectBox("planVariant", "Mass")

      const microCells = getRowCells("Micro")
      act(() => {
        userEvent.click(getByRole(microCells[0], "button"))
      })

      clickDropItem("2")

      clickButtonWithName("Clear Custom Plan")

      const message = screen.queryByTestId("summary")
      expect(message).not.toBeInTheDocument()
    })

    it("resets the deliveries table back to match the 'Customer Plan' when you click on it", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "6")
      changeSelectBox("mealsPerDay", "2")
      changeSelectBox("planVariant", "Mass")

      const microCells = getRowCells("Micro")
      act(() => {
        userEvent.click(getByRole(microCells[0], "button"))
      })

      clickDropItem("2")
      const massCells = getRowCells("Mass")

      act(() => {
        userEvent.click(getByRole(massCells[1], "button"))
      })

      clickDropItem("0")
      clickButtonWithName("Clear Custom Plan")

      const microCellsAfter = getRowCells("Micro")
      expect(getByRole(microCellsAfter[0], "textbox")).toHaveDisplayValue("0")

      const massCellsAfter = getRowCells("Mass")
      expect(getByRole(massCellsAfter[1], "textbox")).toHaveDisplayValue("4")
    })

    it("reenables the 'Customer Plan' fields when you click on it", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "6")
      changeSelectBox("mealsPerDay", "2")

      const cells = getRowCells("Micro")

      act(() => {
        userEvent.click(getByRole(cells[0], "button"))
      })

      clickDropItem("2")

      clickButtonWithName("Clear Custom Plan")

      const daysPerWeek = screen.getByTestId("daysPerWeek").closest("button")
      expect(daysPerWeek).not.toHaveAttribute("disabled")

      const mealsPerDay = screen.getByTestId("mealsPerDay").closest("button")
      expect(mealsPerDay).not.toHaveAttribute("disabled")

      const totalPlans = screen.getByTestId("totalPlans").closest("button")
      expect(totalPlans).not.toHaveAttribute("disabled")

      const variant = screen.getByTestId("planVariant").closest("button")
      expect(variant).not.toHaveAttribute("disabled")

      const oneExtra = screen.getByLabelText("Breakfast").closest("input")
      expect(oneExtra).not.toHaveAttribute("disabled")

      const twoExtra = screen.getByLabelText("Large Snack").closest("input")
      expect(twoExtra).not.toHaveAttribute("disabled")
    })
  })

  describe("meal deliveries table", () => {
    it("disables all the 'Customer Plan' fields if you make direct changes", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("mealsPerDay", "3")

      const cells = getRowCells("Mass")

      act(() => {
        userEvent.click(getByRole(cells[0], "button"))
      })

      clickDropItem("4")

      const daysPerWeek = screen.getByTestId("daysPerWeek").closest("button")
      expect(daysPerWeek).toHaveAttribute("disabled")

      const mealsPerDay = screen.getByTestId("mealsPerDay").closest("button")
      expect(mealsPerDay).toHaveAttribute("disabled")

      const totalPlans = screen.getByTestId("totalPlans").closest("button")
      expect(totalPlans).toHaveAttribute("disabled")

      const variant = screen.getByTestId("planVariant").closest("button")
      expect(variant).toHaveAttribute("disabled")

      const oneExtra = screen.getByLabelText("Breakfast").closest("input")
      expect(oneExtra).toHaveAttribute("disabled")

      const twoExtra = screen.getByLabelText("Large Snack").closest("input")
      expect(twoExtra).toHaveAttribute("disabled")
    })

    it("allows direct changes to be made in multiple columns and rows which are still reflected in the row total", () => {
      render(
        <PlanPanel
          exclusions={[]}
          plannerConfig={{
            defaultDeliveryDays: ["Monday", "Thursday"],
            extrasLabels: ["Breakfast", "Large Snack"],
            planLabels: ["EQ", "Mass", "Micro"],
          }}
        />
      )

      changeSelectBox("daysPerWeek", "5")
      changeSelectBox("mealsPerDay", "3")

      const massCells = getRowCells("Mass")

      act(() => {
        userEvent.click(getByRole(massCells[0], "button"))
      })

      clickDropItem("4")
      const massCellsAfterClick = getRowCells("Mass")

      act(() => {
        userEvent.click(getByRole(massCellsAfterClick[1], "button"))
      })
      clickDropItem("7")

      const massCellsAfterBothClicks = getRowCells("Mass")
      expect(massCellsAfterBothClicks)

      expect(
        getByRole(massCellsAfterBothClicks[0], "textbox")
      ).toHaveDisplayValue("4")

      expect(
        getByRole(massCellsAfterBothClicks[1], "textbox")
      ).toHaveDisplayValue("7")

      expect(massCellsAfterBothClicks[2]).toHaveTextContent("11")

      const microCells = getRowCells("Micro")
      act(() => {
        userEvent.click(getByRole(microCells[0], "button"))
      })
      clickDropItem("1")

      const microCellsAfterClick = getRowCells("Micro")
      expect(getByRole(microCellsAfterClick[0], "textbox")).toHaveDisplayValue(
        "1"
      )

      expect(microCellsAfterClick[2]).toHaveTextContent("1")

      const eqCells = getRowCells("EQ")
      expect(getByRole(eqCells[0], "textbox")).toHaveDisplayValue("6")

      expect(getByRole(eqCells[1], "textbox")).toHaveDisplayValue("6")
    })
  })
})
