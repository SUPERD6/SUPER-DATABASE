#include "widget.h"
#include "./ui_widget.h"
#include<iostream>
#include<cmath>
#include<QStack>

using namespace std;
Widget::Widget(QWidget *parent)
    : QWidget(parent)
    , ui(new Ui::Widget)
{
    ui->setupUi(this);
    s="";
    res="";
    setWindowTitle("计算器");
}

Widget::~Widget()
{
    delete ui;
}


void Widget::on_pushButton_clicked()
{
    s+="1";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_4_clicked()
{
    s+="2";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_5_clicked()
{
    s+="3";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_2_clicked()
{
    s+="4";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_7_clicked()
{
    s+="5";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_10_clicked()
{
    s+="6";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_3_clicked()
{
    s+="7";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_8_clicked()
{
    s+="8";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_11_clicked()
{
    s+="9";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_16_clicked()
{
    s+="00";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_9_clicked()
{
    s+="0";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_12_clicked()
{
    s+=".";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_13_clicked()
{
    s+="+";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_14_clicked()
{
    s+="-";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_18_clicked()
{
    s+="/";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_15_clicked()
{
    s+="*";
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_6_clicked()
{
    s=s.left(s.length()-1);
    ui->textEdit->setText(s);
}


void Widget::on_pushButton_17_clicked()
{
    s="";
    res="";
    ui->textEdit->setText(s);
    ui->textEdit_3->setText(res);
}

//-----------------------------------------------------------------------------

int symbol(char c)
{
    switch (c)
    {
    case '#': return 0;
    case '+': return 2;
    case '-': return 2;
    case '*': return 3;
    case '/': return 3;

    default: break;
    }
    return 0;
}

double jisuan( char c='#',double b=1,double a=1)
{
    switch (c)
    {
    case '+': return b + a;
    case '-': return b - a;
    case '*': return b * a;
    case '/': return b / a;
    default: break;
    }
    return 0;
}
void Widget::on_pushButton_19_clicked()
{
    QStack<double>s1;
    QStack<char>s2;
    s = s + '#';
    char *a=s.toLocal8Bit().data();

    s2.push('#');

    for (int i = 0;i<strlen(a); i++)
    {
        if (a[i] <= 47||a[i]==124)                  //用阿斯克码判断扫描到的是数字还是运算符
        {
            if (a[i] == '#'&&s2.top() == '#') break; //两个#碰到一起运算结束

            if (symbol(s2.top()) >= symbol(a[i])) //判断运算符优先级
            {
                char temp1 = s2.top();
                s2.pop();
                double temp2 = s1.top();
                s1.pop();
                double temp3 = s1.top();
                s1.pop();
                s1.push(jisuan(temp1, temp3, temp2));
                i--;//要把a[i]再走一遍 不然同级运算a[i]不能push
                continue;
            }
            else
            {
                s2.push(a[i]);
                continue;
            }
        }
        else                     //对数字的运算
        {
            double sum = static_cast<int>(a[i]) - 48;
            for (; a[i + 1] > 47&& a[ i + 1 ] != 124 ; i++)     //实现多位数的运算
                sum = sum * 10 + static_cast<int>(a[i + 1]) - 48;
            if(static_cast<int>(a[i+1])==46)    //计算小数
            {
                int j=1;
                i=i+2;
                for(;a[i]>47&&a[ i ] != 124;i++)
                {
                    sum=sum+pow(10,-j)*(static_cast<int>(a[i]) - 48);
                    j++;
                }
                i--;
            }
            s1.push(sum);
        }
    }
    double num = s1.top();
    res = QString::number(num);
    ui->textEdit_3->setText(res);
}

