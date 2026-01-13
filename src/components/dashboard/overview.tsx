"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Fev",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Abr",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Mai",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Jul",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Ago",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Set",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Out",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Nov",
        total: Math.floor(Math.random() * 50) + 10,
    },
    {
        name: "Dez",
        total: Math.floor(Math.random() * 50) + 10,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
